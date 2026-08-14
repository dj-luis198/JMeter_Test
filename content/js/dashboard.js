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

    var data = {"OkPercent": 97.51693002257336, "KoPercent": 2.4830699774266365};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8069275176395125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42200b9c-3e52-44af-b76b-c5f3a4b6f4a1"], "isController": false}, {"data": [0.38181818181818183, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/957020f5-4ab5-4aa2-8ee4-49f555191007"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb3e5b29-4658-4d0a-87cb-e909d9ee7ed4"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b2210b55-7769-4b53-bcbe-a70badd55025"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7df029d7-52be-4d01-a45b-55b57dbca478"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb2bede5-bd55-476d-ad77-95d6ee581e9d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb2bede5-bd55-476d-ad77-95d6ee581e9d"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/28dc0be6-5c54-4e83-b331-0ea7e6286778"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69f84ed1-7fd9-45e9-b347-4ad6611111be"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.043478260869565216, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2532ca70-c6f4-44bc-8c8e-8186540ae021"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7d05bb6b-295a-4ed1-a592-e096a89e5e88"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ecc98b3-66d3-4e08-a614-9387f82462b9"], "isController": false}, {"data": [0.32, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7df029d7-52be-4d01-a45b-55b57dbca478"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d05bb6b-295a-4ed1-a592-e096a89e5e88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/fb3e5b29-4658-4d0a-87cb-e909d9ee7ed4"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2210b55-7769-4b53-bcbe-a70badd55025"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/42200b9c-3e52-44af-b76b-c5f3a4b6f4a1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=957020f5-4ab5-4aa2-8ee4-49f555191007"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=867068f4-e761-4134-a683-66b51163bd39"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/199cbef8-0db0-407d-81f4-a6e85f2e1287"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8942c6f-92a5-4f25-9a6b-a3d0e6596878"], "isController": false}, {"data": [0.39166666666666666, 500, 1500, "addBook"], "isController": true}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9314285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/276227fc-285c-415f-8c67-33da86c5fcba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8942c6f-92a5-4f25-9a6b-a3d0e6596878"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28dc0be6-5c54-4e83-b331-0ea7e6286778"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d25b0ca-1112-4470-9215-9a5b7de0e2e8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/69f84ed1-7fd9-45e9-b347-4ad6611111be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/867068f4-e761-4134-a683-66b51163bd39"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2532ca70-c6f4-44bc-8c8e-8186540ae021"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5ecc98b3-66d3-4e08-a614-9387f82462b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1329, 33, 2.4830699774266365, 305.7787810383747, 77, 3006, 96.0, 852.0, 1030.0, 1446.7, 5.208578281521893, 734.7832712205964, 3.799686056030428], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42200b9c-3e52-44af-b76b-c5f3a4b6f4a1", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1349.5090909090911, 959, 2068, 1342.0, 1671.6, 1724.5999999999997, 2068.0, 0.24510240824257118, 294.93953090323583, 1.205166626466158], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/957020f5-4ab5-4aa2-8ee4-49f555191007", 3, 0, 0.0, 412.6666666666667, 200, 610, 428.0, 610.0, 610.0, 610.0, 0.062189054726368154, 0.028138927757048092, 0.03988035084991708], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 442.1764705882353, 83, 1038, 470.0, 984.4, 1038.0, 1038.0, 0.09695835923642442, 0.020123538138855777, 0.06480971209070739], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 442.1764705882353, 83, 1038, 470.0, 984.4, 1038.0, 1038.0, 0.09736038806705268, 0.020206978520580267, 0.06507843954206255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 138.70588235294122, 80, 240, 83.0, 238.4, 240.0, 240.0, 0.10922080592105263, 0.04852445502030222, 0.06121083309775905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 115.88235294117646, 79, 245, 82.0, 242.6, 245.0, 245.0, 0.1092194025056216, 0.08116793486990041, 0.054823020398329585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 175.94117647058823, 78, 626, 83.0, 497.1999999999999, 626.0, 626.0, 0.1092194025056216, 3.80410777385159, 0.06321148209123033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 199.8823529411765, 78, 865, 81.0, 857.8, 865.0, 865.0, 0.10922150764229314, 11.588058133950543, 0.06310603882503357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb3e5b29-4658-4d0a-87cb-e909d9ee7ed4", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 228.58823529411765, 79, 440, 200.0, 397.59999999999997, 440.0, 440.0, 0.0974334873164525, 0.1715272663315719, 0.06296683894244547], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b2210b55-7769-4b53-bcbe-a70badd55025", 3, 0, 0.0, 314.33333333333337, 178, 575, 190.0, 575.0, 575.0, 575.0, 0.03351019268360793, 0.027936068835520803, 0.021489283719631387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 99.78947368421053, 80, 238, 82.0, 237.0, 238.0, 238.0, 0.09607605177993528, 0.07140026894973706, 0.048225674428600325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 96.68421052631578, 79, 237, 80.0, 236.0, 237.0, 237.0, 0.0960867410411757, 0.02571071000515834, 0.054799469500045515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 621.5714285714286, 471, 712, 631.0, 712.0, 712.0, 712.0, 0.03605793995837884, 10.602231584051058, 0.020564293882512928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 785.8571428571428, 544, 1096, 844.0, 1096.0, 1096.0, 1096.0, 0.03607689532546513, 32.46205383027109, 0.02053987302221306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 138.42857142857142, 78, 324, 81.0, 324.0, 324.0, 324.0, 0.03611766102027233, 0.06391132985227876, 0.019998743943842195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7df029d7-52be-4d01-a45b-55b57dbca478", 3, 0, 0.0, 367.33333333333337, 200, 629, 273.0, 629.0, 629.0, 629.0, 0.02511679308785854, 0.02519037744260813, 0.016106797650742622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 96.89999999999999, 79, 236, 81.5, 220.80000000000007, 236.0, 236.0, 0.06412188287496874, 0.04765307897251095, 0.03218617948997454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 161.59999999999997, 80, 264, 160.5, 261.40000000000003, 264.0, 264.0, 0.06418567632447142, 0.036455458349914635, 0.035527774746787505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 253.4, 78, 799, 82.0, 797.4, 799.0, 799.0, 0.06393453104021482, 11.519466566236174, 0.0364876366600601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 204.50000000000003, 77, 473, 160.0, 471.7, 473.0, 473.0, 0.06406273022543674, 3.781127480028444, 0.03662336159567448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 81.99999999999999, 80, 86, 82.0, 86.0, 86.0, 86.0, 0.03616281532683436, 0.02687490474972749, 0.020306268372001716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 104.57894736842105, 78, 243, 79.0, 237.0, 243.0, 243.0, 0.09608722697320178, 0.025898510395120793, 0.05648877991979245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 622.2142857142857, 79, 1091, 780.0, 1088.5, 1091.0, 1091.0, 0.07352053060817233, 42.53458603510343, 0.039160349590123045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 113.52631578947371, 79, 242, 81.0, 238.0, 242.0, 242.0, 0.0960862551140645, 0.025898248448712698, 0.056582042806426654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 425.2857142857143, 78, 699, 544.5, 671.5, 699.0, 699.0, 0.07358274379539793, 13.915792351467976, 0.03926534528702526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb2bede5-bd55-476d-ad77-95d6ee581e9d", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb2bede5-bd55-476d-ad77-95d6ee581e9d", 3, 0, 0.0, 357.6666666666667, 307, 428, 338.0, 428.0, 428.0, 428.0, 0.020520537638086117, 0.024254580782516504, 0.013159329149423716], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 344.9411764705881, 81, 569, 407.0, 515.4, 569.0, 569.0, 0.09740724824523707, 0.02021670426872941, 0.06552383254548058], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/28dc0be6-5c54-4e83-b331-0ea7e6286778", 3, 0, 0.0, 407.3333333333333, 208, 627, 387.0, 627.0, 627.0, 627.0, 0.04532064355313845, 0.028723728189440294, 0.029063042903542568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 398.9, 161, 879, 318.0, 877.6, 879.0, 879.0, 0.06383820844451822, 15.353687614110799, 0.14030690617698507], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69f84ed1-7fd9-45e9-b347-4ad6611111be", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 549.608695652174, 96, 1103, 480.0, 1068.2, 1102.2, 1103.0, 0.10416902556670214, 0.06398663777485904, 0.04709986214588193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 94.42857142857143, 79, 254, 81.0, 174.0, 254.0, 254.0, 0.07358081012471948, 0.054682613774327656, 0.03693411758213458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 158.78571428571428, 78, 239, 158.0, 239.0, 239.0, 239.0, 0.07352207500301966, 0.09066149845866221, 0.037961104852982104], "isController": false}, {"data": ["login", 23, 0, 0.0, 2587.478260869566, 1444, 4660, 2417.0, 3681.0, 4466.199999999997, 4660.0, 0.10297554554653152, 37.633421363899906, 0.20733709856326726], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 93.4736842105263, 82, 243, 84.0, 97.0, 243.0, 243.0, 0.0930756607147231, 0.07535129173096236, 0.03308548876968673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 729.0714285714287, 161, 1172, 861.5, 1171.0, 1172.0, 1172.0, 0.07348927056649729, 56.55985139255606, 0.15319150122832068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2532ca70-c6f4-44bc-8c8e-8186540ae021", 3, 0, 0.0, 377.0, 189, 491, 451.0, 491.0, 491.0, 491.0, 0.026700843746662394, 0.026779068874826447, 0.017122611387019832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d05bb6b-295a-4ed1-a592-e096a89e5e88", 3, 0, 0.0, 455.66666666666663, 177, 915, 275.0, 915.0, 915.0, 915.0, 0.018472110192294666, 0.025465295138140595, 0.011845721705345213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 372.8235294117647, 161, 950, 318.0, 939.6, 950.0, 950.0, 0.10916119255392241, 15.513361861728086, 0.24222020822497478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, 53.333333333333336, 465.33333333333337, 79, 1176, 82.0, 1051.8000000000002, 1176.0, 1176.0, 0.07723399325489792, 43.13041844733929, 0.10856504872177741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ecc98b3-66d3-4e08-a614-9387f82462b9", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["register", 25, 7, 28.0, 1048.48, 354, 2632, 960.0, 1510.8000000000004, 2330.1999999999994, 2632.0, 0.10158472165786266, 0.03193569687119057, 0.045832169341731004], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 231.6842105263158, 162, 482, 168.0, 480.0, 482.0, 482.0, 0.09603623093175362, 0.14883740086786423, 0.21598773421467635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 93.58823529411765, 80, 240, 83.0, 125.5999999999999, 240.0, 240.0, 0.09463476547278415, 0.07347132670982753, 0.03363970178915374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7df029d7-52be-4d01-a45b-55b57dbca478", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 329.9444444444444, 163, 1086, 244.5, 977.1000000000001, 1086.0, 1086.0, 0.1035071678713751, 13.901542759961126, 0.22984745990534844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 93.92857142857142, 79, 247, 81.5, 168.5, 247.0, 247.0, 0.06914160694971924, 0.05138355750853158, 0.03470584567593329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 91.71428571428571, 78, 237, 80.0, 161.0, 237.0, 237.0, 0.06914536330949465, 0.018501786666798373, 0.039434465012446164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 91.85714285714285, 77, 238, 80.0, 162.0, 238.0, 238.0, 0.06914399731326182, 0.0186364680258401, 0.04064910779549181], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d05bb6b-295a-4ed1-a592-e096a89e5e88", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 114.49999999999999, 79, 236, 81.0, 236.0, 236.0, 236.0, 0.06914502180537652, 0.01863674415848039, 0.04071723452015824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 86.25, 81, 91, 86.5, 91.0, 91.0, 91.0, 0.05048783874184306, 0.014889968066441994, 0.031209767503502593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb3e5b29-4658-4d0a-87cb-e909d9ee7ed4", 3, 0, 0.0, 1265.3333333333333, 194, 3006, 596.0, 3006.0, 3006.0, 3006.0, 0.04643315946694733, 0.029852047508860998, 0.029776472705041097], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 920.7090909090906, 628, 1684, 852.0, 1312.8, 1383.5999999999997, 1684.0, 0.24465321518807157, 292.6903005842764, 0.4830945323342586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2210b55-7769-4b53-bcbe-a70badd55025", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 1048.48, 354, 2632, 960.0, 1510.8000000000004, 2330.1999999999994, 2632.0, 0.10382835926273559, 0.0326410404432225, 0.04684443552674203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 120.99999999999999, 80, 318, 82.0, 318.0, 318.0, 318.0, 0.07139712269595536, 0.019243755726644215, 0.042043422837559644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 105.33333333333334, 79, 235, 79.0, 235.0, 235.0, 235.0, 0.07126567844925884, 0.019208327394526797, 0.04189642424458381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42200b9c-3e52-44af-b76b-c5f3a4b6f4a1", 3, 0, 0.0, 708.3333333333333, 194, 1491, 440.0, 1491.0, 1491.0, 1491.0, 0.026132176548984764, 0.02605561743800141, 0.016757938737467445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 136.23529411764707, 78, 803, 80.0, 349.3999999999996, 803.0, 803.0, 0.09403695099015377, 5.001185185377254, 0.05480807127447727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 149.94117647058826, 79, 625, 82.0, 318.59999999999974, 625.0, 625.0, 0.0940348703425082, 1.6502882065061069, 0.05489868952728118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 91.00000000000001, 79, 242, 82.0, 116.39999999999989, 242.0, 242.0, 0.09403539049578777, 0.06988372281962353, 0.047201358119955975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=957020f5-4ab5-4aa2-8ee4-49f555191007", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 0.9409586588541666, 3.590901692708333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 79.83333333333333, 78, 81, 80.0, 81.0, 81.0, 81.0, 0.07139797229758674, 0.019104535556190204, 0.04071915607596744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=867068f4-e761-4134-a683-66b51163bd39", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 103.76470588235294, 78, 242, 80.0, 238.0, 242.0, 242.0, 0.09403539049578777, 0.033469857508725935, 0.05316499961279546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 81.0, 80, 84, 80.5, 84.0, 84.0, 84.0, 0.07139627311454343, 0.05305914437516362, 0.03583758240319856], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 559.3125, 80, 1491, 533.0, 1274.7000000000003, 1491.0, 1491.0, 0.09500679892404801, 0.019228670973641553, 0.06464451870149458], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 111.16666666666667, 80, 235, 88.0, 235.0, 235.0, 235.0, 0.08216251745953496, 0.06467088776600115, 0.029206207378194068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1439.0434782608695, 756, 2377, 1313.0, 2036.2, 2312.999999999999, 2377.0, 0.1056305685680169, 0.054672071622118124, 0.04858593534720308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 228.83333333333334, 162, 399, 166.0, 399.0, 399.0, 399.0, 0.07119633576191944, 0.11034041489664666, 0.16012222779267626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/199cbef8-0db0-407d-81f4-a6e85f2e1287", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 1.5352689302884617, 2.86865234375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8942c6f-92a5-4f25-9a6b-a3d0e6596878", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["addBook", 60, 10, 16.666666666666668, 884.15, 406, 1763, 725.0, 1433.7, 1659.0499999999995, 1763.0, 0.2914319020788809, 94.127182324048, 1.05831427135953], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 143.00000000000009, 80, 601, 83.0, 323.4, 331.99999999999994, 601.0, 0.24535170051033153, 0.1823365664925413, 0.11860262866466222], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 495.21818181818185, 386, 733, 468.0, 662.9999999999999, 718.5999999999999, 733.0, 0.24535060601599684, 72.14122457554345, 0.12339410361156092], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 127.92727272727274, 79, 337, 84.0, 241.0, 244.39999999999998, 337.0, 0.24579357808415075, 0.43493941746922, 0.11953632996670616], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 775.7272727272725, 546, 1125, 770.0, 1008.6, 1023.9999999999999, 1125.0, 0.24536811909722378, 220.7826648748288, 0.12316329415622365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 95.88888888888889, 80, 237, 85.0, 123.60000000000018, 237.0, 237.0, 0.10047053701502034, 0.07505855548485406, 0.03571413620455801], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 10, 5.714285714285714, 149.18285714285716, 79, 972, 87.0, 314.8, 380.4, 753.1200000000026, 0.6969501461604021, 1.5033938049594973, 0.3357067286056218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 109.78571428571429, 82, 259, 84.5, 251.5, 259.0, 259.0, 0.07256969282285738, 0.056198990633326076, 0.025796257995625082], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/276227fc-285c-415f-8c67-33da86c5fcba", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.64252703722334, 1.2005627515090542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 85.17647058823529, 80, 100, 85.0, 92.0, 100.0, 100.0, 0.11213794286241993, 0.09100256886588963, 0.03986153437687584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8942c6f-92a5-4f25-9a6b-a3d0e6596878", 3, 0, 0.0, 566.3333333333333, 243, 1182, 274.0, 1182.0, 1182.0, 1182.0, 0.022583899185474036, 0.026693404278143304, 0.014482513475059848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28dc0be6-5c54-4e83-b331-0ea7e6286778", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 209.78571428571425, 160, 486, 166.0, 402.5, 486.0, 486.0, 0.06911293547320146, 0.10711155136325265, 0.15543661171365522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d25b0ca-1112-4470-9215-9a5b7de0e2e8", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.9237104668674698, 3.5944559487951806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69f84ed1-7fd9-45e9-b347-4ad6611111be", 3, 0, 0.0, 422.66666666666663, 173, 852, 243.0, 852.0, 852.0, 852.0, 0.07702775566795902, 0.035755722520348164, 0.04939605425321591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/867068f4-e761-4134-a683-66b51163bd39", 2, 0, 0.0, 234.0, 176, 292, 234.0, 292.0, 292.0, 292.0, 0.01715515984320184, 0.0288069310062359, 0.01066333910175583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 266.2352941176471, 160, 887, 167.0, 565.3999999999997, 887.0, 887.0, 0.09399067833625442, 6.751541343458525, 0.20997262694270438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 85.39999999999999, 81, 110, 82.0, 107.5, 110.0, 110.0, 0.06533727099286517, 0.05417123346967044, 0.02322535804824504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2532ca70-c6f4-44bc-8c8e-8186540ae021", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 86.85714285714285, 81, 96, 85.0, 95.5, 96.0, 96.0, 0.07296607077708865, 0.05664846315213426, 0.02593715797154323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ecc98b3-66d3-4e08-a614-9387f82462b9", 3, 0, 0.0, 441.6666666666667, 338, 575, 412.0, 575.0, 575.0, 575.0, 0.03358409457281032, 0.027997677799794018, 0.021536675230610782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 90.33333333333334, 79, 239, 81.0, 100.40000000000022, 239.0, 239.0, 0.1036466340755584, 0.07702645364404291, 0.052025751869958024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 134.94444444444446, 78, 269, 81.5, 249.20000000000005, 269.0, 269.0, 0.10365021507419628, 0.045032059587356975, 0.05814579122543346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 228.61111111111111, 78, 1005, 84.0, 897.0000000000002, 1005.0, 1005.0, 0.10355897683730884, 10.378427604364436, 0.059892507220362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 158.05555555555557, 78, 463, 81.5, 462.1, 463.0, 463.0, 0.10355838103730977, 3.4081000273279063, 0.05999329387567241], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 21.21212121212121, 0.526711813393529], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 12.121212121212121, 0.3009781790820166], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 12.121212121212121, 0.3009781790820166], "isController": false}, {"data": ["401/Unauthorized", 18, 54.54545454545455, 1.3544018058690745], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1329, 33, "401/Unauthorized", 18, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
