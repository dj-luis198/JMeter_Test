/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 68.0064308681672, "KoPercent": 31.993569131832796};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5247933884297521, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e118c0b6-08a3-475d-9f54-d36aa538ac0d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb1e4049-d177-4e70-a8ea-be02382c09eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/04520c0d-a03e-497d-8752-475ea175fa0a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/773f5381-b531-4b47-b867-42c181d96ac9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3cb6fe2c-6db4-4028-bcee-9ba61687117f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e118c0b6-08a3-475d-9f54-d36aa538ac0d"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a6adc98-d4dc-4f83-aedc-8247a0363371"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=773f5381-b531-4b47-b867-42c181d96ac9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b578186f-0827-4f7b-8b3d-fa9409d6486f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a6adc98-d4dc-4f83-aedc-8247a0363371"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/74cb6ec4-eb3b-4055-9f11-b59bf3b59fe5"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d43bff75-298e-4a50-989f-6f02968cd4a8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ceb0577-d8d4-4de9-934c-2a255e886682"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0ceb0577-d8d4-4de9-934c-2a255e886682"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9485714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d43bff75-298e-4a50-989f-6f02968cd4a8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3a84fda3-d6e8-4493-8af0-2cf1edd1d10c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/efcd8ae5-3bee-457c-9e8e-8f9a47df410d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d8e9fc2-685c-4085-9baf-a8baf85461e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a84fda3-d6e8-4493-8af0-2cf1edd1d10c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=efcd8ae5-3bee-457c-9e8e-8f9a47df410d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74cb6ec4-eb3b-4055-9f11-b59bf3b59fe5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb1e4049-d177-4e70-a8ea-be02382c09eb"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9fa00e8d-3e6c-45c6-9dad-68a43dc21082"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=372d3580-600a-4d3b-b962-632e2eac10c4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04520c0d-a03e-497d-8752-475ea175fa0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9fa00e8d-3e6c-45c6-9dad-68a43dc21082"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=149aea65-e126-4f7f-9932-937d6d865a3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3cc906da-5d79-4e68-9d5f-e5004d75f4a3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/149aea65-e126-4f7f-9932-937d6d865a3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6d68e92-5498-4b35-9f18-3008433079f1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6d68e92-5498-4b35-9f18-3008433079f1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/372d3580-600a-4d3b-b962-632e2eac10c4"], "isController": false}, {"data": [0.375, 500, 1500, "register"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 622, 199, 31.993569131832796, 269.83440514469476, 102, 2229, 116.0, 615.5000000000002, 931.4000000000001, 1446.349999999999, 2.416021876262391, 2.5474539093817006, 1.1589681156485971], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 59, 100.0, 614.3389830508476, 419, 954, 648.0, 801.0, 864.0, 954.0, 0.2665004426617522, 1.71499669132925, 0.44737720794487507], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 20, 100.0, 142.70000000000002, 104, 329, 111.0, 323.8, 328.75, 329.0, 0.11375011375011375, 0.056541804588679585, 0.05709722506597506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 164.94117647058826, 104, 348, 114.0, 336.0, 348.0, 348.0, 0.09813486038872951, 0.07618868555570309, 0.03488387615380619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e118c0b6-08a3-475d-9f54-d36aa538ac0d", 3, 0, 0.0, 310.0, 196, 522, 212.0, 522.0, 522.0, 522.0, 0.03548154368369386, 0.029579503051412756, 0.02275346388570212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 18, 100.0, 178.38888888888889, 108, 536, 111.5, 478.4000000000001, 536.0, 536.0, 0.11398248469151906, 0.056657309285139845, 0.05721386438617265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb1e4049-d177-4e70-a8ea-be02382c09eb", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.4949700342465754, 1.8889126712328768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04520c0d-a03e-497d-8752-475ea175fa0a", 2, 0, 0.0, 328.5, 275, 382, 328.5, 382.0, 382.0, 382.0, 0.027341453745095626, 0.03086593801692436, 0.01699495635620446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/773f5381-b531-4b47-b867-42c181d96ac9", 3, 0, 0.0, 634.3333333333334, 280, 1109, 514.0, 1109.0, 1109.0, 1109.0, 0.02781873313489304, 0.023191333189603213, 0.01783948706892555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cb6fe2c-6db4-4028-bcee-9ba61687117f", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 1.5352689302884617, 2.86865234375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 110.0, 110, 110, 110.0, 110.0, 110.0, 110.0, 9.09090909090909, 2.6811079545454546, 5.619673295454546], "isController": false}, {"data": ["https://demoqa.com/books", 59, 59, 100.0, 220.59322033898303, 102, 617, 112.0, 450.0, 458.0, 617.0, 0.2584409440541061, 0.12846332082376954, 0.12492994854177983], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 464.875, 111, 936, 429.5, 770.8000000000002, 936.0, 936.0, 0.08710469439862376, 0.01698073693293483, 0.05868296000805718], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 464.875, 111, 936, 429.5, 770.8000000000002, 936.0, 936.0, 0.08718110785392805, 0.016995633452480848, 0.05873444021555529], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e118c0b6-08a3-475d-9f54-d36aa538ac0d", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 859.1250000000002, 258, 1718, 886.0, 1231.0, 1613.75, 1718.0, 0.0989360254925159, 0.03135228542218888, 0.0446371521265062], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a6adc98-d4dc-4f83-aedc-8247a0363371", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=773f5381-b531-4b47-b867-42c181d96ac9", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 111.60000000000001, 107, 118, 111.0, 117.8, 118.0, 118.0, 0.0582679275846196, 0.04586323206367519, 0.020712427383595248], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 512.5714285714286, 108, 1481, 430.0, 1073.5, 1481.0, 1481.0, 0.08563110121596162, 0.017405763737675238, 0.05776634904154332], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1233.739130434783, 684, 2229, 1075.0, 2200.8, 2226.0, 2229.0, 0.09591126123308522, 0.049641570755405436, 0.04411543363357728], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 204.43749999999997, 107, 382, 194.0, 310.6000000000001, 382.0, 382.0, 0.08635625192277592, 0.16287725200913217, 0.054910854036345186], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 10, 100.0, 128.9, 105, 311, 109.5, 291.20000000000005, 311.0, 311.0, 0.057723389517432465, 0.028692583265989377, 0.028974435753867465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b578186f-0827-4f7b-8b3d-fa9409d6486f", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.6896081349206349, 3.1570353835978837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a6adc98-d4dc-4f83-aedc-8247a0363371", 3, 0, 0.0, 270.0, 192, 421, 197.0, 421.0, 421.0, 421.0, 0.023776689333777162, 0.02810324185252112, 0.015247421219902673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74cb6ec4-eb3b-4055-9f11-b59bf3b59fe5", 3, 0, 0.0, 261.6666666666667, 185, 408, 192.0, 408.0, 408.0, 408.0, 0.07239556939115326, 0.03275710984821062, 0.04642554417336325], "isController": false}, {"data": ["addBook", 58, 58, 100.0, 712.7413793103449, 447, 1443, 668.5, 901.5, 1372.3, 1443.0, 0.2651186177263793, 0.8928067648100745, 0.5179303249417196], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d43bff75-298e-4a50-989f-6f02968cd4a8", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.504648219273743, 1.925846717877095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ceb0577-d8d4-4de9-934c-2a255e886682", 1, 0, 0.0, 850.0, 850, 850, 850.0, 850.0, 850.0, 850.0, 1.176470588235294, 0.21254595588235295, 0.8111213235294118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ceb0577-d8d4-4de9-934c-2a255e886682", 3, 0, 0.0, 330.0, 190, 581, 219.0, 581.0, 581.0, 581.0, 0.02970532319391635, 0.024319299424706908, 0.0190493120742237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 137.94444444444449, 107, 324, 112.5, 324.0, 324.0, 324.0, 0.10985255346157602, 0.08206758144346256, 0.0390491498632946], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 395.6666666666667, 110, 850, 390.0, 648.4000000000001, 850.0, 850.0, 0.08554612647139337, 0.016106731624692033, 0.05857347735023725], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 7, 4.0, 186.39428571428573, 105, 1088, 116.0, 333.0, 423.19999999999965, 1050.0000000000005, 0.7142740526685278, 1.612704856349284, 0.340862579029322], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 137.4, 107, 372, 111.5, 346.2000000000001, 372.0, 372.0, 0.08789817874973631, 0.06806958569193446, 0.031245055727445327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d43bff75-298e-4a50-989f-6f02968cd4a8", 3, 0, 0.0, 299.6666666666667, 206, 411, 282.0, 411.0, 411.0, 411.0, 0.0240080667104147, 0.028376722078618417, 0.01539579798812401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 16, 100.0, 172.99999999999997, 107, 445, 112.0, 366.6000000000001, 445.0, 445.0, 0.06893877375156189, 0.03426741781205567, 0.034604032918264464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a84fda3-d6e8-4493-8af0-2cf1edd1d10c", 3, 0, 0.0, 377.0, 200, 666, 265.0, 666.0, 666.0, 666.0, 0.07346099221313482, 0.03323918592977129, 0.047108774303344925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 117.21428571428572, 110, 137, 112.0, 137.0, 137.0, 137.0, 0.07979663258210504, 0.06475683757395438, 0.02836520923817015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 446.86956521739125, 134, 932, 408.0, 770.8000000000001, 903.5999999999996, 932.0, 0.09705828983293315, 0.059618812797768504, 0.043884754094382854], "isController": false}, {"data": ["login", 23, 5, 21.73913043478261, 1991.8695652173917, 1118, 3062, 1879.0, 2680.0, 2997.599999999999, 3062.0, 0.09482033607625204, 0.1412642642766445, 0.14233920609612308], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/efcd8ae5-3bee-457c-9e8e-8f9a47df410d", 3, 0, 0.0, 266.3333333333333, 217, 353, 229.0, 353.0, 353.0, 353.0, 0.019949859353491556, 0.027502491654308837, 0.01279336683801379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 10, 100.0, 111.3, 106, 122, 111.0, 121.2, 122.0, 122.0, 0.08048807971539415, 0.04000823493665588, 0.040401243138391205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d8e9fc2-685c-4085-9baf-a8baf85461e1", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 0.9229362355491331, 1.7245077673410405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 135.05, 106, 324, 114.0, 303.50000000000045, 323.95, 324.0, 0.11174245598744015, 0.09046337501326941, 0.039720951151785366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a84fda3-d6e8-4493-8af0-2cf1edd1d10c", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 0.7140872035573123, 2.7251111660079053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, 100.0, 132.58823529411765, 104, 309, 111.0, 307.4, 309.0, 309.0, 0.0992358836955443, 0.04932721171975787, 0.04981176193311501], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=efcd8ae5-3bee-457c-9e8e-8f9a47df410d", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74cb6ec4-eb3b-4055-9f11-b59bf3b59fe5", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 0.6766444288389513, 2.5822214419475653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 118.68749999999999, 109, 150, 115.0, 136.0, 150.0, 150.0, 0.07072167044585592, 0.05863544746926922, 0.02513934379130035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb1e4049-d177-4e70-a8ea-be02382c09eb", 3, 0, 0.0, 297.0, 227, 390, 274.0, 390.0, 390.0, 390.0, 0.09789205769105266, 0.045377047575540036, 0.06277583126672323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 12, 100.0, 127.74999999999999, 107, 324, 109.5, 261.0000000000002, 324.0, 324.0, 0.1360343713511614, 0.06761864747826285, 0.06828287780712594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9fa00e8d-3e6c-45c6-9dad-68a43dc21082", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.506061799719888, 1.9312412464985995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=372d3580-600a-4d3b-b962-632e2eac10c4", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04520c0d-a03e-497d-8752-475ea175fa0a", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 113.75, 109, 124, 112.5, 123.4, 124.0, 124.0, 0.13033136750187352, 0.10118499723045844, 0.0463287282916816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fa00e8d-3e6c-45c6-9dad-68a43dc21082", 3, 0, 0.0, 521.3333333333334, 187, 863, 514.0, 863.0, 863.0, 863.0, 0.025173064820641914, 0.029753710404866792, 0.016142883364799666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=149aea65-e126-4f7f-9932-937d6d865a3e", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 0.5982253725165563, 2.282957367549669], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cc906da-5d79-4e68-9d5f-e5004d75f4a3", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 1.1364268238434163, 2.123415258007117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/149aea65-e126-4f7f-9932-937d6d865a3e", 3, 0, 0.0, 621.6666666666667, 183, 1481, 201.0, 1481.0, 1481.0, 1481.0, 0.07805182641273806, 0.03618027370173795, 0.050052766286814446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6d68e92-5498-4b35-9f18-3008433079f1", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 14, 100.0, 110.42857142857143, 106, 113, 111.5, 112.5, 113.0, 113.0, 0.07855635857610989, 0.039048033706288995, 0.039431609675898906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 8, 100.0, 135.375, 104, 324, 109.0, 324.0, 324.0, 324.0, 0.09999750006249844, 0.04970578860528487, 0.05657817538936527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6d68e92-5498-4b35-9f18-3008433079f1", 3, 0, 0.0, 257.6666666666667, 189, 368, 216.0, 368.0, 368.0, 368.0, 0.023615724924036085, 0.023684911618149472, 0.015144198600374702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/372d3580-600a-4d3b-b962-632e2eac10c4", 3, 0, 0.0, 500.6666666666667, 185, 878, 439.0, 878.0, 878.0, 878.0, 0.023295000116475003, 0.02336324718712874, 0.01493852546531763], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 859.1250000000002, 258, 1718, 886.0, 1231.0, 1613.75, 1718.0, 0.09885574475446704, 0.03132684489533648, 0.04460093171539431], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 2.512562814070352, 0.8038585209003215], "isController": false}, {"data": ["401/Unauthorized", 10, 5.025125628140704, 1.607717041800643], "isController": false}, {"data": ["404/Not Found", 184, 92.46231155778895, 29.581993569131832], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 622, 199, "404/Not Found", 184, "401/Unauthorized", 10, "406/Not Acceptable", 5, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 59, 59, "404/Not Found", 59, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
