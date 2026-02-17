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

    var data = {"OkPercent": 70.37643207855974, "KoPercent": 29.623567921440262};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5347985347985348, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c6cf006-68b7-4777-8cc8-379a09eec666"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f48c1bc8-5f4c-42fa-9a8b-1e12d595a546"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/514ad74b-24e5-406f-a3bb-6952be11bf95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c02eb666-21ed-477f-8ea3-de098167994c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8dfabd40-c173-413c-a2a9-9a11bd4bfe6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab137cfc-08e4-4eb6-a61f-9436f31d3a88"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6822f92d-efe1-47bd-b07c-8f79760ba3be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ed9acd3-6a9c-4a53-be4f-bdeed770d3e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dacda3c1-4616-4eb5-b356-86a7baa17c86"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cd884d7d-fac6-460c-8c9d-0638f2c7fd98"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d488fa7c-696f-4783-9238-3c8c485d93fe"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab137cfc-08e4-4eb6-a61f-9436f31d3a88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e31a833-b6d0-480b-8ff5-12d311892c51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9918918918918919, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bb078be0-bce6-46e3-a30e-97955d6fa458"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e31a833-b6d0-480b-8ff5-12d311892c51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e83b961b-5fed-46b4-a088-066b448056a1"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d488fa7c-696f-4783-9238-3c8c485d93fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1686a54b-5fd1-4a85-94b0-fc6ce21afac5"], "isController": false}, {"data": [0.05, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6ed9acd3-6a9c-4a53-be4f-bdeed770d3e1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb078be0-bce6-46e3-a30e-97955d6fa458"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5c8227c0-7887-45c7-9e5a-696ec859f602"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b7d3e744-b58b-4e3b-a802-866a12fb5f72"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6822f92d-efe1-47bd-b07c-8f79760ba3be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd884d7d-fac6-460c-8c9d-0638f2c7fd98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=514ad74b-24e5-406f-a3bb-6952be11bf95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8dfabd40-c173-413c-a2a9-9a11bd4bfe6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dacda3c1-4616-4eb5-b356-86a7baa17c86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c8227c0-7887-45c7-9e5a-696ec859f602"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eec9dd5d-f05a-445b-a98b-2d65581994d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/284832c0-21c1-49d3-af6b-c03f92311b39"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 611, 181, 29.623567921440262, 238.793780687398, 79, 2025, 88.0, 607.2000000000013, 946.1999999999999, 1700.5999999999992, 2.3919136875401263, 2.5010871083779618, 1.1423392639384757], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/2c6cf006-68b7-4777-8cc8-379a09eec666", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["see books", 57, 57, 100.0, 463.4736842105264, 323, 679, 495.0, 592.8000000000001, 631.0, 679.0, 0.2500976258276257, 1.6101020176187195, 0.41984161991961777], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 22, 100.0, 126.31818181818178, 79, 244, 83.0, 242.4, 243.85, 244.0, 0.11569144041102014, 0.057506780438680904, 0.05807168005006284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 111.5, 83, 245, 84.5, 243.8, 245.0, 245.0, 0.14434353761953447, 0.11206358633547843, 0.051309616888193896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f48c1bc8-5f4c-42fa-9a8b-1e12d595a546", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, 100.0, 92.1875, 80, 241, 82.5, 131.80000000000013, 241.0, 241.0, 0.1053248283534438, 0.05235384534365516, 0.052868126732099716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/514ad74b-24e5-406f-a3bb-6952be11bf95", 3, 0, 0.0, 507.3333333333333, 486, 547, 489.0, 547.0, 547.0, 547.0, 0.026025175019302006, 0.026101420649241366, 0.016689321220060206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c02eb666-21ed-477f-8ea3-de098167994c", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 1.995849609375, 3.729248046875], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, 100.0, 151.5614035087719, 80, 415, 84.0, 330.0, 332.4, 415.0, 0.24717054767789773, 0.12286114137504878, 0.11948185654351502], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 534.0, 377, 768, 466.0, 766.8, 768.0, 768.0, 0.09288572733394741, 0.016781112848418232, 0.06313326779729238], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 534.0, 377, 768, 466.0, 766.8, 768.0, 768.0, 0.09235884489871314, 0.016685924127208915, 0.06277515239209408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, 9.523809523809524, 1049.8571428571431, 365, 2017, 959.0, 1816.2000000000003, 2004.3999999999999, 2017.0, 0.08745408660453262, 0.02806143961919992, 0.039456824229779364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8dfabd40-c173-413c-a2a9-9a11bd4bfe6b", 3, 0, 0.0, 378.6666666666667, 315, 488, 333.0, 488.0, 488.0, 488.0, 0.018594157715645744, 0.02563354750187491, 0.011923987858015012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab137cfc-08e4-4eb6-a61f-9436f31d3a88", 3, 0, 0.0, 296.3333333333333, 179, 357, 353.0, 357.0, 357.0, 357.0, 0.019666972597351513, 0.023245695801101352, 0.012611958338796381], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6822f92d-efe1-47bd-b07c-8f79760ba3be", 1, 0, 0.0, 702.0, 702, 702, 702.0, 702.0, 702.0, 702.0, 1.4245014245014245, 0.2573562143874644, 0.9821269586894588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ed9acd3-6a9c-4a53-be4f-bdeed770d3e1", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 122.46153846153848, 79, 245, 85.0, 244.6, 245.0, 245.0, 0.058027424653620915, 0.04567392995197114, 0.020626936107341808], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 524.8181818181819, 353, 841, 524.0, 811.4000000000001, 841.0, 841.0, 0.12002575097930102, 0.021684339776533872, 0.08169721526618437], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dacda3c1-4616-4eb5-b356-86a7baa17c86", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1194.35, 669, 1817, 1108.5, 1774.1000000000001, 1815.15, 1817.0, 0.09290917199345919, 0.04808775503567712, 0.04273458985246023], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 214.83333333333334, 154, 486, 167.0, 440.10000000000014, 486.0, 486.0, 0.09202242279702154, 0.25349601332024574, 0.059491058487918226], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cd884d7d-fac6-460c-8c9d-0638f2c7fd98", 3, 0, 0.0, 514.0, 154, 1002, 386.0, 1002.0, 1002.0, 1002.0, 0.02605478452693196, 0.02613111690347571, 0.016708309087908844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 13, 100.0, 83.76923076923079, 79, 92, 84.0, 90.8, 92.0, 92.0, 0.0607277993179801, 0.030185986184425657, 0.03048250864203298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d488fa7c-696f-4783-9238-3c8c485d93fe", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.49227264986376024, 1.8786188692098094], "isController": false}, {"data": ["addBook", 64, 64, 100.0, 553.7031250000001, 408, 2299, 478.0, 655.5, 731.0, 2299.0, 0.29979389169945664, 0.9218149826681656, 0.5879548508642496], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab137cfc-08e4-4eb6-a61f-9436f31d3a88", 1, 0, 0.0, 853.0, 853, 853, 853.0, 853.0, 853.0, 853.0, 1.1723329425556857, 0.21179843200468934, 0.8082686107854631], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e31a833-b6d0-480b-8ff5-12d311892c51", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 0.9409586588541666, 3.590901692708333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 85.0625, 81, 93, 84.0, 90.2, 93.0, 93.0, 0.10639712727756351, 0.07948613512435164, 0.0378208538369464], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 503.90909090909093, 192, 1009, 423.0, 977.8000000000001, 1009.0, 1009.0, 0.12439498801284661, 0.022473703889039673, 0.08576451321979464], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 0, 0.0, 155.76756756756754, 80, 2025, 90.0, 248.0, 349.79999999999995, 1078.999999999985, 0.7564482098755335, 1.5519367182516641, 0.3675985312126887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 111.0, 81, 249, 85.0, 247.8, 249.0, 249.0, 0.06479395522239279, 0.0501773500892163, 0.02303222627045994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, 100.0, 93.92857142857144, 81, 241, 83.0, 162.5, 241.0, 241.0, 0.07546396865011132, 0.037510898479401034, 0.0378793748888254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb078be0-bce6-46e3-a30e-97955d6fa458", 3, 0, 0.0, 418.33333333333337, 160, 841, 254.0, 841.0, 841.0, 841.0, 0.019757899866963472, 0.023353168755515748, 0.012670267818332697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 101.21052631578947, 82, 248, 84.0, 237.0, 248.0, 248.0, 0.10247172589352649, 0.08315820724367237, 0.036425496313714494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e31a833-b6d0-480b-8ff5-12d311892c51", 3, 0, 0.0, 238.0, 154, 399, 161.0, 399.0, 399.0, 399.0, 0.06825783258628929, 0.030884891697572296, 0.0437721126936816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e83b961b-5fed-46b4-a088-066b448056a1", 2, 0, 0.0, 188.5, 184, 193, 188.5, 193.0, 193.0, 193.0, 0.08454872120059184, 0.05197599608962164, 0.05255396586345381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 537.8999999999999, 150, 1300, 515.5, 959.7000000000004, 1283.85, 1300.0, 0.09279708988326126, 0.05700133743805794, 0.04195805919526364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d488fa7c-696f-4783-9238-3c8c485d93fe", 3, 0, 0.0, 347.0, 169, 693, 179.0, 693.0, 693.0, 693.0, 0.03667840375586855, 0.030577276047779732, 0.02352098157521518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1686a54b-5fd1-4a85-94b0-fc6ce21afac5", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 1.068013168896321, 1.9955842391304348], "isController": false}, {"data": ["login", 20, 1, 5.0, 2084.95, 1408, 2995, 2029.0, 2714.1, 2981.1499999999996, 2995.0, 0.08885808475284124, 0.1297380102675517, 0.13391191053768026], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 13, 100.0, 95.23076923076924, 81, 242, 83.0, 179.19999999999993, 242.0, 242.0, 0.06419182492420428, 0.031907850475019504, 0.03222128712015722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 102.9090909090909, 81, 248, 88.5, 202.4999999999999, 247.7, 248.0, 0.11578703606239868, 0.09373774696848487, 0.04115867297530579], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ed9acd3-6a9c-4a53-be4f-bdeed770d3e1", 3, 0, 0.0, 452.6666666666667, 154, 816, 388.0, 816.0, 816.0, 816.0, 0.01939287376532037, 0.026734642056032477, 0.012436185324765993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 12, 100.0, 96.25, 80, 241, 83.0, 194.20000000000016, 241.0, 241.0, 0.1414677276746242, 0.07031940760389035, 0.07101016799292661], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb078be0-bce6-46e3-a30e-97955d6fa458", 1, 0, 0.0, 1009.0, 1009, 1009, 1009.0, 1009.0, 1009.0, 1009.0, 0.9910802775024776, 0.179052589197225, 0.6833033944499505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c8227c0-7887-45c7-9e5a-696ec859f602", 3, 0, 0.0, 403.3333333333333, 164, 592, 454.0, 592.0, 592.0, 592.0, 0.018465742969168367, 0.02545651740704037, 0.01184163855770237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7d3e744-b58b-4e3b-a802-866a12fb5f72", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6822f92d-efe1-47bd-b07c-8f79760ba3be", 3, 0, 0.0, 521.6666666666666, 165, 838, 562.0, 838.0, 838.0, 838.0, 0.016662871234885388, 0.022971113176998573, 0.010685500108308663], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd884d7d-fac6-460c-8c9d-0638f2c7fd98", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.4949700342465754, 1.8889126712328768], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=514ad74b-24e5-406f-a3bb-6952be11bf95", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.5251862281976745, 2.0042242005813957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8dfabd40-c173-413c-a2a9-9a11bd4bfe6b", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 86.21428571428572, 83, 92, 85.5, 91.0, 92.0, 92.0, 0.07577438717464373, 0.06282466280397708, 0.026935426690986638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 12, 100.0, 83.08333333333334, 81, 90, 83.0, 88.2, 90.0, 90.0, 0.11975569837531436, 0.059527002415073256, 0.06011174703604647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dacda3c1-4616-4eb5-b356-86a7baa17c86", 3, 0, 0.0, 356.6666666666667, 270, 524, 276.0, 524.0, 524.0, 524.0, 0.01770329281246312, 0.024405418314056414, 0.011352697539242299], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 85.16666666666666, 81, 94, 84.0, 92.2, 94.0, 94.0, 0.1124258691925012, 0.08728375586722505, 0.03996388318952191], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c8227c0-7887-45c7-9e5a-696ec859f602", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eec9dd5d-f05a-445b-a98b-2d65581994d7", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 1.3195699896694215, 2.46561854338843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/284832c0-21c1-49d3-af6b-c03f92311b39", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 1.341747636554622, 2.5070575105042017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 19, 100.0, 115.8421052631579, 81, 376, 83.0, 242.0, 376.0, 376.0, 0.10299219427580225, 0.05119436219373374, 0.05169725376734605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 1, 1, 100.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 6.061833079268292, 6.847846798780488], "isController": false}, {"data": ["register", 21, 2, 9.523809523809524, 1049.8571428571431, 365, 2017, 959.0, 1816.2000000000003, 2004.3999999999999, 2017.0, 0.09113831758665736, 0.02924360078812945, 0.04111904562991767], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 1.1049723756906078, 0.32733224222585927], "isController": false}, {"data": ["404/Not Found", 179, 98.89502762430939, 29.2962356792144], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 611, 181, "404/Not Found", 179, "406/Not Acceptable", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 22, "404/Not Found", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, "404/Not Found", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 1, 1, "404/Not Found", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
