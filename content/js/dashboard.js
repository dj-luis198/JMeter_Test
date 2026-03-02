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

    var data = {"OkPercent": 99.92205767731879, "KoPercent": 0.0779423226812159};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8445491251682369, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4642857142857143, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87586c84-d9a7-4597-b4e2-f340eab270b2"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f8a0738e-e14f-4de9-83d8-49ea4808c634"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/07df5834-021e-4abe-8cda-97703598a2dd"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f9e3f29-7b54-4b35-9c93-fd4fd642a891"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33d213d7-6b90-4341-99fd-dca9818473db"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/51c0a9f2-bf45-4be7-a86c-7c9897552174"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30749fa4-f718-4aa2-aec9-e33fe1d28cbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a72f8888-4339-4f9b-94c2-f390e2defe80"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.05, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3dc626d1-3749-47a7-a914-6aaaa4b182b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e384f6b-911f-45e1-b3c7-7f422dca77fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/208a5e7f-8142-4eea-bd64-b02438ad22ea"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf76266c-46f7-481f-837f-3dd827723138"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4094f53d-909c-498c-bd1e-0d79fd876e90"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/74058fcf-e9c4-415e-9a19-b4f8f5e1a0c0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9da435ed-898f-4ce8-95bc-8b120241d519"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e1f775a-2027-406e-b430-49c9e2498f27"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca3cda10-2341-4c49-999c-d0719106442c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa33fd9f-0a44-4d13-8bf9-15a108e1aebd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bf76266c-46f7-481f-837f-3dd827723138"], "isController": false}, {"data": [0.45, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/33d213d7-6b90-4341-99fd-dca9818473db"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07df5834-021e-4abe-8cda-97703598a2dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9801136363636364, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51c0a9f2-bf45-4be7-a86c-7c9897552174"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3dc626d1-3749-47a7-a914-6aaaa4b182b8"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=208a5e7f-8142-4eea-bd64-b02438ad22ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30749fa4-f718-4aa2-aec9-e33fe1d28cbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e384f6b-911f-45e1-b3c7-7f422dca77fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87586c84-d9a7-4597-b4e2-f340eab270b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/608ee9c9-2dee-49b4-b201-3278a444fc2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4094f53d-909c-498c-bd1e-0d79fd876e90"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a72f8888-4339-4f9b-94c2-f390e2defe80"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1283, 1, 0.0779423226812159, 279.09353078721716, 81, 2336, 102.0, 676.6000000000001, 877.1999999999989, 1412.080000000003, 5.049014399332569, 718.9101644127127, 3.6758916387750924], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1220.7142857142858, 987, 1794, 1167.5, 1447.7, 1576.5499999999997, 1794.0, 0.24653855466772323, 296.66943798977525, 1.2122281472187368], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/87586c84-d9a7-4597-b4e2-f340eab270b2", 3, 0, 0.0, 297.3333333333333, 187, 398, 307.0, 398.0, 398.0, 398.0, 0.020418441936757282, 0.024133907119910706, 0.013093857622204375], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 535.25, 352, 709, 536.5, 702.1, 709.0, 709.0, 0.06414231040602084, 0.011588210376087746, 0.04359672660409228], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 535.25, 352, 709, 536.5, 702.1, 709.0, 709.0, 0.06424877124225, 0.011607444023258055, 0.04366908670371679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 124.56249999999997, 81, 253, 84.0, 248.8, 253.0, 253.0, 0.1254508389524855, 0.03356790026658303, 0.07154618159008938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 95.12499999999999, 82, 249, 84.5, 138.40000000000012, 249.0, 249.0, 0.12544297048954117, 0.09322470756107505, 0.06296649104650798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 124.87499999999999, 82, 256, 84.5, 250.4, 256.0, 256.0, 0.1254528062224592, 0.0338134516771472, 0.07387504116420204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 124.37499999999999, 82, 248, 85.0, 245.9, 248.0, 248.0, 0.12545182257975993, 0.03381318655470091, 0.07375195038380417], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 190.99999999999997, 163, 255, 184.0, 246.90000000000003, 255.0, 255.0, 0.06443125989959463, 0.1593635483502913, 0.04165380278665199], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f8a0738e-e14f-4de9-83d8-49ea4808c634", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 1.6376201923076923, 3.059895833333333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 93.65, 82, 256, 84.5, 94.50000000000001, 247.94999999999987, 256.0, 0.134508941481885, 0.09996221139425243, 0.06751718351727432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 92.5, 82, 252, 84.0, 89.80000000000001, 243.8999999999999, 252.0, 0.13451165543494342, 0.04609388661340005, 0.07614883462464522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 516.7543112917399, 1.0023066783831285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 1, 0, 0.0, 725.0, 725, 725, 725.0, 725.0, 725.0, 725.0, 1.379310344827586, 1241.1058728448277, 0.7852909482758621], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 1, 0, 0.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 20.81801470588235, 6.514246323529411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 105.75, 83, 248, 85.5, 245.9, 248.0, 248.0, 0.08259087577299898, 0.061378570764894745, 0.04145674819074363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 114.375, 82, 250, 84.0, 247.2, 250.0, 250.0, 0.08252399643083716, 0.04532171141874223, 0.04576495554019692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 213.3125, 81, 725, 84.0, 722.9, 725.0, 725.0, 0.08252314516337003, 13.940785412422313, 0.04718486473940738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07df5834-021e-4abe-8cda-97703598a2dd", 3, 0, 0.0, 506.0, 228, 915, 375.0, 915.0, 915.0, 915.0, 0.03268223067118407, 0.027245830972950004, 0.02095833151765385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 187.5, 83, 591, 85.0, 587.5, 591.0, 591.0, 0.08259300746950511, 4.571541111314725, 0.04730546765709448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 1, 0, 0.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 8.743106617647058, 6.6061580882352935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 132.14999999999998, 81, 574, 84.0, 245.9, 557.5999999999998, 574.0, 0.1345125601103003, 6.086174473299256, 0.07850068937687056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 440.87499999999994, 81, 770, 569.5, 758.8, 770.0, 770.0, 0.08773084177742686, 49.346595854854804, 0.04686403364477782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 137.7, 82, 568, 84.0, 332.50000000000017, 556.6499999999999, 568.0, 0.13451075077175542, 2.011973453462643, 0.07863099161325468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 387.5, 81, 592, 493.5, 590.6, 592.0, 592.0, 0.08773180387555243, 16.13140699195061, 0.04695022316777611], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 469.0909090909091, 183, 900, 441.0, 847.8000000000002, 900.0, 900.0, 0.06991051454138703, 0.012630317568512305, 0.04820002272091723], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7f9e3f29-7b54-4b35-9c93-fd4fd642a891", 2, 0, 0.0, 212.0, 166, 258, 212.0, 258.0, 258.0, 258.0, 0.013188088518450136, 0.0260670812122491, 0.00819747884960304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33d213d7-6b90-4341-99fd-dca9818473db", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51c0a9f2-bf45-4be7-a86c-7c9897552174", 3, 0, 0.0, 408.0, 163, 634, 427.0, 634.0, 634.0, 634.0, 0.018489414810021264, 0.021853862361714587, 0.01185681874210348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 341.1875, 168, 812, 174.5, 807.1, 812.0, 812.0, 0.08248570677362313, 18.606663967085623, 0.18155514878359358], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30749fa4-f718-4aa2-aec9-e33fe1d28cbf", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 0.28272936228482004, 1.0789563771517996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a72f8888-4339-4f9b-94c2-f390e2defe80", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 418.95000000000005, 106, 985, 395.0, 725.8000000000002, 972.3499999999998, 985.0, 0.09096946155175707, 0.05587870245708515, 0.04113169990084328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 85.75, 82, 100, 84.0, 94.4, 100.0, 100.0, 0.08772795560965446, 0.06519626388569047, 0.04403532146812734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 177.6875, 83, 257, 246.0, 255.6, 257.0, 257.0, 0.08764962064148565, 0.10573163466542497, 0.045386925141745874], "isController": false}, {"data": ["login", 20, 0, 0.0, 2013.8499999999997, 1328, 3200, 1856.5, 3162.000000000001, 3199.9, 3200.0, 0.08959770629871874, 5.488091379860675, 0.1426125991174626], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 97.0, 84, 254, 87.0, 109.10000000000002, 246.7999999999999, 254.0, 0.13455328310010764, 0.10893034344725512, 0.04782948735199139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3dc626d1-3749-47a7-a914-6aaaa4b182b8", 3, 0, 0.0, 440.6666666666667, 183, 955, 184.0, 955.0, 955.0, 955.0, 0.02109912368306303, 0.024938449900130815, 0.01353036251811008], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e384f6b-911f-45e1-b3c7-7f422dca77fa", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/208a5e7f-8142-4eea-bd64-b02438ad22ea", 3, 0, 0.0, 304.3333333333333, 255, 374, 284.0, 374.0, 374.0, 374.0, 0.022370030124973902, 0.026440618288990962, 0.014345364370507352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 557.0625, 168, 854, 663.5, 843.5, 854.0, 854.0, 0.0876069078046804, 65.55611436328942, 0.18302058351676032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf76266c-46f7-481f-837f-3dd827723138", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 282.1875, 166, 495, 330.5, 388.60000000000014, 495.0, 495.0, 0.12536041118214866, 0.19428415287702142, 0.2819385028832894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 1, 0, 0.0, 810.0, 810, 810, 810.0, 810.0, 810.0, 810.0, 1.2345679012345678, 1476.9724151234566, 2.7838059413580245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4094f53d-909c-498c-bd1e-0d79fd876e90", 3, 0, 0.0, 550.6666666666666, 176, 1036, 440.0, 1036.0, 1036.0, 1036.0, 0.020100502512562814, 0.02771016541038526, 0.01288997068676717], "isController": false}, {"data": ["register", 21, 1, 4.761904761904762, 1134.142857142857, 642, 1843, 1025.0, 1782.0, 1839.0, 1843.0, 0.08923070386029021, 0.028780885508508786, 0.040258383968216876], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/74058fcf-e9c4-415e-9a19-b4f8f5e1a0c0", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 0.9979248046875, 1.8646240234375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 241.20000000000002, 166, 831, 171.5, 418.50000000000017, 810.7999999999997, 831.0, 0.1344338988519345, 8.239412962872718, 0.3006251806455516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 86.5625, 85, 90, 86.0, 90.0, 90.0, 90.0, 0.09371577177866677, 0.0727578501601954, 0.03331302824944795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9da435ed-898f-4ce8-95bc-8b120241d519", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 1.1871224442379182, 2.218140102230483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e1f775a-2027-406e-b430-49c9e2498f27", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 0.9979248046875, 1.8646240234375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 419.4117647058823, 167, 996, 334.0, 983.2, 996.0, 996.0, 0.10611735330836454, 29.99711664130774, 0.23227191596441948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 84.625, 83, 89, 84.0, 89.0, 89.0, 89.0, 0.0402303185738352, 0.02989772698700058, 0.020193734127882126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 105.375, 82, 244, 84.5, 244.0, 244.0, 244.0, 0.0402303185738352, 0.018317759799854165, 0.022521513791456088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 164.625, 82, 730, 83.5, 730.0, 730.0, 730.0, 0.04023092551244141, 4.534470242001589, 0.02321921579868445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 125.125, 81, 410, 84.0, 410.0, 410.0, 410.0, 0.040230520884669156, 1.4881265746477315, 0.023258269886449353], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 785.5178571428573, 643, 1444, 665.5, 1087.7, 1213.0499999999997, 1444.0, 0.2598559655505234, 310.87807534894944, 0.5131140257257406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 1, 4.761904761904762, 1134.142857142857, 642, 1843, 1025.0, 1782.0, 1839.0, 1843.0, 0.08572233311698649, 0.02764927932009944, 0.03867550576176539], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca3cda10-2341-4c49-999c-d0719106442c", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 165.0, 6.0606060606060606, 1.9353693181818181, 3.6162405303030303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 131.28571428571428, 83, 251, 86.0, 251.0, 251.0, 251.0, 0.03465809786456605, 0.009341440440058819, 0.020409016613606768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 83.14285714285715, 82, 84, 83.0, 84.0, 84.0, 84.0, 0.034686950273779146, 0.009349217065979534, 0.02039213287579594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 115.3125, 82, 249, 84.0, 249.0, 249.0, 249.0, 0.09705793145283591, 0.02616014558689718, 0.05705944798301486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 104.6875, 81, 244, 83.5, 243.3, 244.0, 244.0, 0.09696323275418002, 0.026134621328275084, 0.05709846616286187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 132.0, 82, 253, 85.0, 253.0, 253.0, 253.0, 0.034658269463093895, 0.00927379475867942, 0.019766044303170735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 105.1875, 82, 251, 85.0, 247.5, 251.0, 251.0, 0.09705616518959315, 0.07212865401296913, 0.048717645417432495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa33fd9f-0a44-4d13-8bf9-15a108e1aebd", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 1.9834530279503104, 3.7060850155279503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 108.14285714285714, 83, 250, 84.0, 250.0, 250.0, 250.0, 0.034685919003424, 0.025777328478130527, 0.01741070543726556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 123.4375, 81, 247, 83.0, 246.3, 247.0, 247.0, 0.09696323275418002, 0.025945240014302078, 0.055299343680118296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 111.14285714285715, 85, 248, 89.0, 248.0, 248.0, 248.0, 0.0339285368076155, 0.026705469401306733, 0.012060534568332074], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 540.8181818181819, 352, 1036, 398.0, 1019.8000000000001, 1036.0, 1036.0, 0.06954586549829614, 0.012564438591000765, 0.04733737134014882], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bf76266c-46f7-481f-837f-3dd827723138", 3, 0, 0.0, 541.6666666666666, 194, 1065, 366.0, 1065.0, 1065.0, 1065.0, 0.041832835987394366, 0.03487431411579329, 0.026826395473687148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1207.8500000000001, 816, 2020, 1157.5, 1502.6000000000001, 1994.3499999999997, 2020.0, 0.09101789866977342, 0.04710887333494132, 0.041864678001428984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 241.71428571428572, 167, 501, 172.0, 501.0, 501.0, 501.0, 0.03464283239797686, 0.0536896240386614, 0.07791254200443427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33d213d7-6b90-4341-99fd-dca9818473db", 3, 0, 0.0, 574.0, 220, 910, 592.0, 910.0, 910.0, 910.0, 0.0644039415212211, 0.02914110635237543, 0.04130070468646014], "isController": false}, {"data": ["addBook", 60, 0, 0.0, 941.8166666666665, 510, 3518, 749.0, 1425.7, 2168.5499999999993, 3518.0, 0.2946853497178388, 112.7375881446856, 1.0685941160544579], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07df5834-021e-4abe-8cda-97703598a2dd", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 146.99999999999991, 82, 364, 86.0, 335.3, 340.25, 364.0, 0.26055358330968187, 0.1936340594713554, 0.1259511950569263], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 462.8035714285715, 400, 681, 412.5, 590.3, 662.55, 681.0, 0.26050388895091364, 76.59679289475643, 0.1310151394626177], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 122.67857142857143, 82, 340, 86.0, 249.0, 256.29999999999995, 340.0, 0.26090440648906527, 0.46167850054510384, 0.12688515081206497], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 631.7857142857143, 559, 1067, 571.5, 747.5, 817.1, 1067.0, 0.26031135096942737, 234.22861118083736, 0.13066409609207583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 89.82352941176471, 84, 121, 89.0, 100.19999999999999, 121.0, 121.0, 0.11144763927677037, 0.08325922270188411, 0.03961615302416447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 0, 0.0, 176.3068181818182, 83, 2336, 95.0, 259.50000000000006, 314.6500000000003, 1439.719999999988, 0.7584539605517753, 1.6076030632813476, 0.3666733350104072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 107.5, 84, 251, 88.0, 251.0, 251.0, 251.0, 0.041111025463141396, 0.03183695624245227, 0.014613684832601044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51c0a9f2-bf45-4be7-a86c-7c9897552174", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.504648219273743, 1.925846717877095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 90.62500000000001, 84, 103, 88.0, 102.3, 103.0, 103.0, 0.12548232267779277, 0.10183184584496659, 0.04460504438937165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3dc626d1-3749-47a7-a914-6aaaa4b182b8", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 251.75000000000003, 166, 814, 171.5, 814.0, 814.0, 814.0, 0.040213129586810094, 6.068142601098321, 0.08915415766060118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=208a5e7f-8142-4eea-bd64-b02438ad22ea", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30749fa4-f718-4aa2-aec9-e33fe1d28cbf", 3, 0, 0.0, 238.0, 159, 383, 172.0, 383.0, 383.0, 383.0, 0.037089695246337394, 0.03092015284045249, 0.023784732954194227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 251.93749999999997, 165, 496, 175.5, 495.3, 496.0, 496.0, 0.09691272403496126, 0.15019579398777688, 0.21795898774659744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e384f6b-911f-45e1-b3c7-7f422dca77fa", 3, 0, 0.0, 269.3333333333333, 161, 484, 163.0, 484.0, 484.0, 484.0, 0.04079246155310499, 0.025375779305984253, 0.026159228274614848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 107.56249999999999, 83, 251, 87.0, 248.9, 251.0, 251.0, 0.08176823814999362, 0.06779417401303181, 0.02906605340488054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 100.68749999999999, 85, 249, 90.0, 153.10000000000008, 249.0, 249.0, 0.0898265785617642, 0.06973840816074466, 0.03193054159812712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87586c84-d9a7-4597-b4e2-f340eab270b2", 1, 0, 0.0, 900.0, 900, 900, 900.0, 900.0, 900.0, 900.0, 1.1111111111111112, 0.2007378472222222, 0.7660590277777778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/608ee9c9-2dee-49b4-b201-3278a444fc2d", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 1.7545930631868132, 3.2784598214285716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 113.17647058823528, 83, 250, 85.0, 246.8, 250.0, 250.0, 0.10628321350422007, 0.07898586472335105, 0.053349191153485465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 160.64705882352942, 81, 254, 87.0, 253.2, 254.0, 254.0, 0.10628122010840685, 0.06599839093358674, 0.05851328202659531], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4094f53d-909c-498c-bd1e-0d79fd876e90", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 294.64705882352933, 82, 746, 243.0, 735.6, 746.0, 746.0, 0.10639163386257956, 22.546958998541808, 0.060395342706227664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a72f8888-4339-4f9b-94c2-f390e2defe80", 3, 0, 0.0, 248.66666666666666, 185, 352, 209.0, 352.0, 352.0, 352.0, 0.040499493756328046, 0.03376276155923051, 0.02597135504556193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 208.11764705882354, 82, 572, 85.0, 568.0, 572.0, 572.0, 0.10639163386257956, 7.382557521888514, 0.06049924078617159], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 1, 100.0, 0.0779423226812159], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1283, 1, "406/Not Acceptable", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 1, "406/Not Acceptable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
