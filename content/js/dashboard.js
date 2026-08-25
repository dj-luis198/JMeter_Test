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

    var data = {"OkPercent": 99.19871794871794, "KoPercent": 0.8012820512820513};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7747404844290657, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.12037037037037036, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/62a30998-5327-422e-84f1-947c16a27dfa"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ce21f96a-4343-4795-99f5-6860a1d4f153"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab135c22-83f3-41b6-9b33-7f227e432df9"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9bd9cee-bf22-4768-b7cb-9a64f95d9fe9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da381288-5db9-4f59-bc05-85bf50a57236"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/56b4aa94-d16c-46fa-bc58-ad1fc374a4f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da381288-5db9-4f59-bc05-85bf50a57236"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d9bd9cee-bf22-4768-b7cb-9a64f95d9fe9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aae38b2d-1139-440d-b747-79653f62c73b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f9e6a84-4729-484a-a93d-7a57f7c61e44"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8418042-b6a5-4b76-9308-2940f8ce4432"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a340d091-8928-4239-a327-6a87117fa53f"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac7e4059-f883-4581-ba05-2cbcf60cdd9a"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ff9d352-5050-453a-ac42-20e2e7b72194"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/29d8ab84-b90d-4469-a64e-b14a7fda697a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7861ae7c-cbbb-44d0-9b2c-a14b5ebd0dc8"], "isController": false}, {"data": [0.42592592592592593, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab135c22-83f3-41b6-9b33-7f227e432df9"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2982456140350877, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad07427e-e78b-4b93-bcb0-f18a6d42b7f2"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9464285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad07427e-e78b-4b93-bcb0-f18a6d42b7f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/576c6ab0-a06e-4300-94b6-b9d00fb92e0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ff9d352-5050-453a-ac42-20e2e7b72194"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ac7e4059-f883-4581-ba05-2cbcf60cdd9a"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a340d091-8928-4239-a327-6a87117fa53f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8418042-b6a5-4b76-9308-2940f8ce4432"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aae38b2d-1139-440d-b747-79653f62c73b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9f9e6a84-4729-484a-a93d-7a57f7c61e44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7861ae7c-cbbb-44d0-9b2c-a14b5ebd0dc8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4d305a74-c34d-467d-832a-255dbd6f8442"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1248, 10, 0.8012820512820513, 386.9727564102564, 100, 2447, 128.0, 1095.2000000000003, 1264.9499999999987, 1738.6699999999998, 4.814796239212041, 695.4832960533041, 3.512751837618296], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1699.8888888888891, 1231, 2174, 1687.0, 2035.0, 2119.25, 2174.0, 0.2407983804079303, 289.7623159383445, 1.1840037552284464], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/62a30998-5327-422e-84f1-947c16a27dfa", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 1.3884171195652173, 2.594259510869565], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 971.9090909090909, 430, 1904, 856.0, 1889.8, 1904.0, 1904.0, 0.08901548869503294, 0.016081899813067475, 0.0605027149724052], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 971.9090909090909, 430, 1904, 856.0, 1889.8, 1904.0, 1904.0, 0.09073886180471347, 0.016393251400265617, 0.06167407013289119], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce21f96a-4343-4795-99f5-6860a1d4f153", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.5692262700534759, 1.0636001559714794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 168.24999999999997, 101, 312, 105.0, 310.6, 312.0, 312.0, 0.0842096398985274, 0.04624745726360775, 0.04669975513415648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 131.0, 103, 309, 104.5, 308.3, 309.0, 309.0, 0.08429526524032054, 0.06264521176551165, 0.04231227181008277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 324.93749999999994, 102, 815, 306.0, 813.6, 815.0, 815.0, 0.08421141275171318, 4.661120199291572, 0.04823241560437479], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab135c22-83f3-41b6-9b33-7f227e432df9", 1, 0, 0.0, 1703.0, 1703, 1703, 1703.0, 1703.0, 1703.0, 1703.0, 0.5871990604815032, 0.10608576776277158, 0.4048462272460364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 320.37500000000006, 102, 1130, 104.5, 1123.0, 1130.0, 1130.0, 0.08430015068651935, 14.240978196227042, 0.048200916237262775], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 429.0, 191, 2041, 223.0, 1729.800000000001, 2041.0, 2041.0, 0.08997292632853206, 0.20864549082276151, 0.05816609104442209], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 115.5909090909091, 103, 351, 104.0, 108.1, 314.6999999999995, 351.0, 0.11122908134890541, 0.08266145596339552, 0.05583178497396229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 122.04545454545456, 101, 308, 103.0, 248.29999999999987, 308.0, 308.0, 0.11123020607923635, 0.029762769986045663, 0.06343597690456448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 660.25, 605, 821, 607.5, 821.0, 821.0, 821.0, 0.2818290706686395, 82.86710438244205, 0.16073064186570846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1160.75, 1104, 1211, 1164.0, 1211.0, 1211.0, 1211.0, 0.2703433360367667, 243.25540897877806, 0.1539161766693701], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 204.5, 103, 308, 203.5, 308.0, 308.0, 308.0, 0.2879147772259411, 0.5094741956380912, 0.1594215612178795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9bd9cee-bf22-4768-b7cb-9a64f95d9fe9", 1, 0, 0.0, 2025.0, 2025, 2025, 2025.0, 2025.0, 2025.0, 2025.0, 0.4938271604938272, 0.08921682098765432, 0.3404706790123457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 121.83333333333333, 102, 308, 104.0, 250.4000000000002, 308.0, 308.0, 0.061530257504127654, 0.04572707613343861, 0.030885305036251576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 120.24999999999999, 100, 309, 103.0, 247.8000000000002, 309.0, 309.0, 0.06153435924784501, 0.0241670587345459, 0.0346631538666653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 204.58333333333334, 102, 910, 104.0, 729.7000000000006, 910.0, 910.0, 0.06153435924784501, 4.629263698125253, 0.035734797167368326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 213.83333333333334, 101, 815, 104.0, 663.8000000000005, 815.0, 815.0, 0.06146974151973691, 1.5213660977727463, 0.035757300812425084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 103.25, 101, 107, 102.5, 107.0, 107.0, 107.0, 0.2922267679719462, 0.21717243205727643, 0.16409217928112213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 658.578947368421, 102, 1318, 812.0, 1313.0, 1318.0, 1318.0, 0.09554220199632917, 45.25906197357504, 0.05184696590651949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 122.13636363636363, 101, 307, 103.5, 244.49999999999986, 306.4, 307.0, 0.11122908134890541, 0.02997971333232216, 0.06539053415238384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 493.68421052631584, 102, 925, 611.0, 924.0, 925.0, 925.0, 0.09554268243623783, 14.797840798233969, 0.05194053002303081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 159.45454545454544, 100, 309, 104.0, 308.7, 309.0, 309.0, 0.11123076845293169, 0.029980168059579242, 0.0655001497823416], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 941.5454545454545, 425, 2025, 858.0, 1960.6000000000004, 2025.0, 2025.0, 0.09037060162174153, 0.01632672001955291, 0.06230629369623976], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da381288-5db9-4f59-bc05-85bf50a57236", 1, 0, 0.0, 1091.0, 1091, 1091, 1091.0, 1091.0, 1091.0, 1091.0, 0.9165902841429882, 0.16559492438130155, 0.6319460357470211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 362.0, 208, 1013, 216.0, 894.5000000000005, 1013.0, 1013.0, 0.06143229393304903, 6.211805791081567, 0.13685283318060584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56b4aa94-d16c-46fa-bc58-ad1fc374a4f5", 1, 0, 0.0, 1200.0, 1200, 1200, 1200.0, 1200.0, 1200.0, 1200.0, 0.8333333333333334, 0.26611328125, 0.4972330729166667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da381288-5db9-4f59-bc05-85bf50a57236", 3, 0, 0.0, 309.3333333333333, 201, 422, 305.0, 422.0, 422.0, 422.0, 0.02092590138320208, 0.024733707005991784, 0.013419279207326856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 729.3333333333333, 360, 1520, 655.0, 1106.2, 1478.8999999999994, 1520.0, 0.10097027627390832, 0.062021781031531574, 0.04565355265119097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 115.05263157894734, 102, 310, 104.0, 110.0, 310.0, 310.0, 0.09554220199632917, 0.07100353097578758, 0.04795770686143866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 146.99999999999997, 101, 309, 104.0, 309.0, 309.0, 309.0, 0.09554316288097836, 0.10109228778103518, 0.050266232280514724], "isController": false}, {"data": ["login", 21, 0, 0.0, 2727.7142857142862, 2006, 3961, 2613.0, 3870.0, 3956.4, 3961.0, 0.09836434152099376, 22.551607978870404, 0.17947924424568604], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 109.81818181818181, 104, 132, 107.0, 127.5, 131.54999999999998, 132.0, 0.10851657837363245, 0.08785180026537236, 0.03857425246875216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9bd9cee-bf22-4768-b7cb-9a64f95d9fe9", 3, 0, 0.0, 315.0, 221, 412, 312.0, 412.0, 412.0, 412.0, 0.01982252234989395, 0.023429550342599262, 0.012711708668389025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aae38b2d-1139-440d-b747-79653f62c73b", 3, 0, 0.0, 285.3333333333333, 207, 410, 239.0, 410.0, 410.0, 410.0, 0.03749297006811223, 0.024104367149909392, 0.024043343435605824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f9e6a84-4729-484a-a93d-7a57f7c61e44", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8418042-b6a5-4b76-9308-2940f8ce4432", 1, 0, 0.0, 924.0, 924, 924, 924.0, 924.0, 924.0, 924.0, 1.0822510822510822, 0.19552387716450215, 0.7461613906926406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a340d091-8928-4239-a327-6a87117fa53f", 3, 0, 0.0, 1002.6666666666666, 392, 2138, 478.0, 2138.0, 2138.0, 2138.0, 0.01817366756727286, 0.02505386788652362, 0.011654337600106618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 775.421052631579, 207, 1422, 917.0, 1416.0, 1422.0, 1422.0, 0.095492262613774, 60.19744183610261, 0.2019050784921269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 528.0, 207, 1243, 412.5, 1229.0, 1243.0, 1243.0, 0.08415914494308738, 18.98414878120463, 0.18523846953964945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1264.75, 1211, 1314, 1267.0, 1314.0, 1314.0, 1314.0, 0.2684563758389262, 321.1671560402684, 0.6053376677852349], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac7e4059-f883-4581-ba05-2cbcf60cdd9a", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1333.3809523809525, 409, 2447, 1245.0, 2218.6000000000004, 2437.0, 2447.0, 0.1053941742115512, 0.03346500286069901, 0.0475508871931022], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ff9d352-5050-453a-ac42-20e2e7b72194", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 285.6363636363637, 206, 660, 211.0, 416.8, 623.6999999999995, 660.0, 0.11117062669914198, 0.17229275837064287, 0.25002534500793355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 107.87500000000001, 103, 129, 106.0, 117.80000000000001, 129.0, 129.0, 0.09606782388366186, 0.07458390623780389, 0.03414910927114543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 499.3333333333333, 207, 1325, 413.0, 1315.4, 1325.0, 1325.0, 0.12664961118569365, 20.372373273871343, 0.2805173451919586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29d8ab84-b90d-4469-a64e-b14a7fda697a", 1, 0, 0.0, 662.0, 662, 662, 662.0, 662.0, 662.0, 662.0, 1.5105740181268883, 0.48238057024169184, 0.901328833081571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 105.0, 103, 107, 105.0, 107.0, 107.0, 107.0, 0.018558815205237295, 0.013792244503110921, 0.009315655288566378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 153.25, 102, 306, 102.5, 306.0, 306.0, 306.0, 0.01855907353104933, 0.01193471671894139, 0.010194803575405515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 305.5, 103, 910, 104.5, 910.0, 910.0, 910.0, 0.018558987421646276, 4.178604046613217, 0.010511926469291836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 282.5, 103, 820, 103.5, 820.0, 820.0, 820.0, 0.018558987421646276, 1.3679912998946777, 0.010530050480445786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7861ae7c-cbbb-44d0-9b2c-a14b5ebd0dc8", 1, 0, 0.0, 858.0, 858, 858, 858.0, 858.0, 858.0, 858.0, 1.1655011655011656, 0.2105641754079254, 0.8035584207459208], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1155.296296296296, 810, 1730, 1028.0, 1597.0, 1685.75, 1730.0, 0.24976642214225583, 298.80747373983587, 0.493191118722306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1333.3809523809525, 409, 2447, 1245.0, 2218.6000000000004, 2437.0, 2447.0, 0.09871993155418078, 0.03134578183835316, 0.044539656619171406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 108.14285714285714, 101, 139, 103.0, 139.0, 139.0, 139.0, 0.038364152535870485, 0.010340337988183842, 0.022591390604619045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 161.71428571428572, 103, 310, 104.0, 310.0, 310.0, 310.0, 0.03836436279533709, 0.010340394659680698, 0.022554049221477464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 148.0625, 101, 413, 103.5, 339.50000000000006, 413.0, 413.0, 0.09103374507137614, 0.024536439101269354, 0.053517885286102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 154.8125, 102, 309, 105.0, 308.3, 309.0, 309.0, 0.09103374507137614, 0.024536439101269354, 0.053606785427773265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 161.85714285714286, 102, 310, 104.0, 310.0, 310.0, 310.0, 0.03836436279533709, 0.010265464263596055, 0.02187967565671568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 125.0625, 102, 415, 104.0, 218.30000000000018, 415.0, 415.0, 0.09103322712790168, 0.06765262289485663, 0.045694412835685025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 133.00000000000003, 102, 305, 105.0, 305.0, 305.0, 305.0, 0.03836373202385128, 0.028510546943506663, 0.019256795176034725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 153.9375, 101, 308, 103.5, 307.3, 308.0, 308.0, 0.09103270919032094, 0.02435836163881635, 0.05191709196010492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 138.2857142857143, 105, 308, 109.0, 308.0, 308.0, 308.0, 0.03674714290963877, 0.028924020688641455, 0.013062460956160657], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 888.2727272727273, 410, 2138, 751.0, 2028.2000000000003, 2138.0, 2138.0, 0.09360746136564776, 0.016911504250629723, 0.0637152349334536], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1439.7142857142856, 813, 2355, 1342.0, 1983.0, 2320.8999999999996, 2355.0, 0.10009055812401697, 0.05180468340403222, 0.04603774694962109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab135c22-83f3-41b6-9b33-7f227e432df9", 3, 0, 0.0, 402.66666666666663, 223, 751, 234.0, 751.0, 751.0, 751.0, 0.021278255750448616, 0.025150177939413713, 0.013645235621218676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 295.7142857142857, 206, 615, 211.0, 615.0, 615.0, 615.0, 0.0383418780947373, 0.05942242239877744, 0.08623178247283203], "isController": false}, {"data": ["addBook", 57, 6, 10.526315789473685, 1144.6491228070167, 528, 2534, 939.0, 1958.2, 2124.7999999999993, 2534.0, 0.26364477335800185, 95.12083718778909, 0.9555948629740981], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad07427e-e78b-4b93-bcb0-f18a6d42b7f2", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.3098868996569468, 1.182595411663808], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 194.38888888888886, 102, 568, 105.0, 417.0, 435.25, 568.0, 0.2511709683571093, 0.1866612372263283, 0.12141565364918858], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 645.0185185185186, 502, 1017, 609.5, 822.5, 914.75, 1017.0, 0.25074759932391016, 73.7281198051134, 0.12610841176934937], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 154.24074074074076, 101, 424, 106.0, 309.5, 316.5, 424.0, 0.25156529516994636, 0.4451526512186941, 0.12234327831507155], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 957.722222222222, 705, 1313, 918.0, 1180.5, 1249.75, 1313.0, 0.2502769267847294, 225.19961866080988, 0.12562728551499114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 121.26666666666667, 103, 311, 108.0, 195.20000000000007, 311.0, 311.0, 0.12363384600168141, 0.09236317596805302, 0.043947968695910195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 6, 3.5714285714285716, 187.797619047619, 102, 1884, 112.0, 325.99999999999994, 385.7499999999999, 1550.7300000000012, 0.7107711443838503, 1.5712598643294424, 0.34159008733388896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 156.5, 105, 310, 105.5, 310.0, 310.0, 310.0, 0.018215931653824433, 0.014106673634260524, 0.006475194455070405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad07427e-e78b-4b93-bcb0-f18a6d42b7f2", 3, 0, 0.0, 369.6666666666667, 306, 490, 313.0, 490.0, 490.0, 490.0, 0.04720469529369188, 0.0303480707047661, 0.030271240146019857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/576c6ab0-a06e-4300-94b6-b9d00fb92e0c", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ff9d352-5050-453a-ac42-20e2e7b72194", 3, 0, 0.0, 397.6666666666667, 287, 485, 421.0, 485.0, 485.0, 485.0, 0.04433541217154849, 0.028503398124612066, 0.02843123762303077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 121.125, 104, 311, 107.5, 178.00000000000014, 311.0, 311.0, 0.0817498556604111, 0.06634192388066565, 0.029059519004286757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac7e4059-f883-4581-ba05-2cbcf60cdd9a", 3, 0, 0.0, 705.0, 245, 1589, 281.0, 1589.0, 1589.0, 1589.0, 0.025922181610804364, 0.021610256219163407, 0.01662327401474108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 411.0, 209, 1013, 211.0, 1013.0, 1013.0, 1013.0, 0.018549864354116912, 5.569583185997171, 0.04053254051985995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a340d091-8928-4239-a327-6a87117fa53f", 1, 0, 0.0, 1238.0, 1238, 1238, 1238.0, 1238.0, 1238.0, 1238.0, 0.8077544426494346, 0.14593219911147012, 0.556908824717286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8418042-b6a5-4b76-9308-2940f8ce4432", 3, 0, 0.0, 433.66666666666663, 200, 875, 226.0, 875.0, 875.0, 875.0, 0.03329633740288568, 0.027064112791342954, 0.02135214345172031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 325.74999999999994, 206, 722, 211.0, 600.2000000000002, 722.0, 722.0, 0.09097835852296636, 0.14099868649994882, 0.2046124606234292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aae38b2d-1139-440d-b747-79653f62c73b", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f9e6a84-4729-484a-a93d-7a57f7c61e44", 3, 0, 0.0, 1213.6666666666667, 234, 2041, 1366.0, 2041.0, 2041.0, 2041.0, 0.0284702912510795, 0.02373451038216621, 0.018257315678589393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 110.33333333333334, 103, 130, 107.0, 127.00000000000001, 130.0, 130.0, 0.061337463389201534, 0.05085498673577354, 0.021803551439130233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7861ae7c-cbbb-44d0-9b2c-a14b5ebd0dc8", 3, 0, 0.0, 524.3333333333334, 191, 897, 485.0, 897.0, 897.0, 897.0, 0.025849144393320582, 0.025924874308535385, 0.01657643699701873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 108.4736842105263, 105, 127, 106.0, 117.0, 127.0, 127.0, 0.09432182607055273, 0.0732283708262592, 0.03352846161101679], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d305a74-c34d-467d-832a-255dbd6f8442", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.7943680037313432, 1.48427782960199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 131.60000000000002, 102, 312, 104.0, 308.4, 312.0, 312.0, 0.12676199168441335, 0.09420495671077984, 0.06362857785721529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 171.1333333333333, 101, 311, 104.0, 309.2, 311.0, 311.0, 0.12697875222212818, 0.059405554262253454, 0.07099567214086176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 312.3333333333333, 102, 1222, 104.0, 1211.2, 1222.0, 1222.0, 0.12697875222212818, 15.263755370143063, 0.07319465313637519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 265.6666666666667, 102, 714, 304.0, 648.6, 714.0, 714.0, 0.12697875222212818, 5.007790675526962, 0.07331865582409211], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 40.0, 0.32051282051282054], "isController": false}, {"data": ["401/Unauthorized", 6, 60.0, 0.4807692307692308], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1248, 10, "401/Unauthorized", 6, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
