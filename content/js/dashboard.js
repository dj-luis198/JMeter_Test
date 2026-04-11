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

    var data = {"OkPercent": 95.9214501510574, "KoPercent": 4.078549848942598};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7156169665809768, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd69b0e8-db26-4a0b-8e83-be5f61919e6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e4601066-3b2b-4acf-920d-781384ff4696"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bee4e217-dcbd-4561-ba31-26ce1367c30c"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dba4f7a3-c299-41a2-a92f-3e7e27f67626"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fda03966-357f-47ee-8cac-070db6097110"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b611d54e-9f95-4741-bbc8-498f2eeaeb17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e29c5153-6f8f-4795-8c79-6b65587e39dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dca9bb66-2104-43da-bf31-b4cee19860ac"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.64, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/639028df-81b4-4965-85ee-adbee8b7e81a"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/529d33b0-1fc6-44e0-81ea-b4e2c50b136d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=395e32f1-1f43-4e4b-82ac-f00897e3097c"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.08695652173913043, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=253ecaf7-a302-43ce-b50d-79758f2d4f76"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8478260869565217, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bee4e217-dcbd-4561-ba31-26ce1367c30c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/10e5ede0-4724-4b9b-9408-035e423f81a6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fda03966-357f-47ee-8cac-070db6097110"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dba4f7a3-c299-41a2-a92f-3e7e27f67626"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b611d54e-9f95-4741-bbc8-498f2eeaeb17"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.36, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e29c5153-6f8f-4795-8c79-6b65587e39dc"], "isController": false}, {"data": [0.2037037037037037, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=639028df-81b4-4965-85ee-adbee8b7e81a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=529d33b0-1fc6-44e0-81ea-b4e2c50b136d"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd69b0e8-db26-4a0b-8e83-be5f61919e6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.41964285714285715, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8810975609756098, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dca9bb66-2104-43da-bf31-b4cee19860ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/395e32f1-1f43-4e4b-82ac-f00897e3097c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10e5ede0-4724-4b9b-9408-035e423f81a6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/253ecaf7-a302-43ce-b50d-79758f2d4f76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1324, 54, 4.078549848942598, 452.0611782477341, 126, 2339, 148.0, 1274.0, 1525.75, 2010.25, 5.292739672361825, 778.1439914262814, 3.875507218803217], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2199.1785714285706, 1684, 2858, 2163.5, 2625.6000000000004, 2789.0, 2858.0, 0.247022496691663, 297.2512845652294, 1.2146076863696516], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd69b0e8-db26-4a0b-8e83-be5f61919e6a", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4601066-3b2b-4acf-920d-781384ff4696", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["deleteBook", 18, 6, 33.333333333333336, 444.94444444444446, 136, 1606, 453.5, 751.9000000000013, 1606.0, 1606.0, 0.1068934391182479, 0.02338293980711673, 0.07094912837308186], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 6, 33.333333333333336, 444.94444444444446, 136, 1606, 453.5, 751.9000000000013, 1606.0, 1606.0, 0.10856649999698426, 0.023748921874340308, 0.07205960074669626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 135.84615384615384, 130, 145, 134.0, 144.2, 145.0, 145.0, 0.08792814241653589, 0.023527647482549645, 0.05014651872193063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 135.84615384615384, 129, 148, 135.0, 144.0, 148.0, 148.0, 0.08793171088053463, 0.06534768748055356, 0.044137597063080854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 177.38461538461536, 131, 406, 138.0, 399.2, 406.0, 406.0, 0.08792933187235366, 0.023699702731220323, 0.05177869835842701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 216.84615384615384, 131, 403, 142.0, 402.6, 403.0, 403.0, 0.08792754770069462, 0.02369922184120285, 0.05169178097247868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bee4e217-dcbd-4561-ba31-26ce1367c30c", 3, 0, 0.0, 382.0, 225, 573, 348.0, 573.0, 573.0, 573.0, 0.044731388014970105, 0.028757972438009753, 0.028685167444495806], "isController": false}, {"data": ["goToProfile", 18, 6, 33.333333333333336, 225.11111111111111, 130, 532, 231.5, 321.4000000000003, 532.0, 532.0, 0.10691312120978136, 0.14367610744174722, 0.06908285989629427], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dba4f7a3-c299-41a2-a92f-3e7e27f67626", 3, 0, 0.0, 345.6666666666667, 229, 488, 320.0, 488.0, 488.0, 488.0, 0.06304507723021961, 0.027910581065461806, 0.040429297572764526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 23, 0, 0.0, 157.34782608695656, 129, 407, 135.0, 285.80000000000035, 401.79999999999995, 407.0, 0.1342125226118924, 0.09974192354262706, 0.06736839513917255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 23, 0, 0.0, 179.43478260869566, 126, 416, 134.0, 407.8, 414.59999999999997, 416.0, 0.1342117394424961, 0.05344079876408494, 0.07556248577647326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 12, 0, 0.0, 948.3333333333333, 743, 1185, 993.0, 1154.1000000000001, 1185.0, 1185.0, 0.06837061430996957, 20.103230725184314, 0.03899261597365452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 12, 0, 0.0, 1401.0833333333333, 1171, 1753, 1407.0, 1713.4, 1753.0, 1753.0, 0.06831573254390709, 61.470616229256215, 0.038894601633884605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 12, 0, 0.0, 290.5833333333333, 129, 410, 392.0, 408.8, 410.0, 410.0, 0.06861455772199668, 0.12141560409400196, 0.03799263108239465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fda03966-357f-47ee-8cac-070db6097110", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 154.9230769230769, 130, 388, 137.0, 289.19999999999993, 388.0, 388.0, 0.0766319661404605, 0.05695012327430707, 0.03846565487909834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 155.30769230769232, 129, 397, 134.0, 298.19999999999993, 397.0, 397.0, 0.07662880417803818, 0.020504191742951622, 0.0437023648827874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 214.6153846153846, 127, 405, 137.0, 401.8, 405.0, 405.0, 0.07662970756924672, 0.020654100868273535, 0.04504988667645169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 193.84615384615387, 130, 406, 135.0, 400.8, 406.0, 406.0, 0.07663241787067986, 0.02065483137920668, 0.04512631638283198], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b611d54e-9f95-4741-bbc8-498f2eeaeb17", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e29c5153-6f8f-4795-8c79-6b65587e39dc", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 12, 0, 0.0, 177.75000000000003, 127, 408, 135.0, 401.70000000000005, 408.0, 408.0, 0.06871986347653788, 0.05107013291566927, 0.038587813963876255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 980.5999999999998, 128, 1989, 1306.0, 1842.6000000000001, 1989.0, 1989.0, 0.07385924397677865, 39.883169486345885, 0.039612789835983236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 23, 0, 0.0, 259.17391304347825, 127, 1450, 134.0, 717.0000000000007, 1344.9999999999986, 1450.0, 0.1342078237326113, 10.533935159386377, 0.07789660964779199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 674.2666666666665, 130, 1184, 758.0, 1168.4, 1184.0, 1184.0, 0.07386106241752181, 13.038526007095586, 0.03968589506066455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 23, 0, 0.0, 213.65217391304344, 127, 811, 136.0, 625.0000000000006, 804.5999999999999, 811.0, 0.1342156553808807, 3.464669552303257, 0.07803222525180023], "isController": false}, {"data": ["deleteBooks", 18, 6, 33.333333333333336, 313.50000000000006, 132, 560, 273.5, 547.4, 560.0, 560.0, 0.10867727678894873, 0.023773154297582536, 0.07234538770618495], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dca9bb66-2104-43da-bf31-b4cee19860ac", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 0.7889260371179039, 3.0107123362445414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 393.8461538461538, 265, 794, 278.0, 693.5999999999999, 794.0, 794.0, 0.07656967840735068, 0.11866804651607964, 0.17220700133996938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 702.56, 196, 2175, 694.0, 1163.6000000000001, 1874.9999999999993, 2175.0, 0.11023365124718353, 0.06771188147898285, 0.04984197317133396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 151.20000000000002, 127, 409, 134.0, 246.4000000000001, 409.0, 409.0, 0.07386033503047969, 0.05489034663886235, 0.03707442598209625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 221.33333333333334, 129, 409, 135.0, 406.0, 409.0, 409.0, 0.0738606987222099, 0.08632469163158284, 0.03840179296846148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/639028df-81b4-4965-85ee-adbee8b7e81a", 3, 0, 0.0, 324.3333333333333, 262, 442, 269.0, 442.0, 442.0, 442.0, 0.08940012516017523, 0.04045122850671991, 0.05733015838722174], "isController": false}, {"data": ["login", 25, 0, 0.0, 3137.5199999999995, 1952, 4827, 2871.0, 4459.6, 4717.5, 4827.0, 0.10922372514068016, 62.86314328678218, 0.2517308205869246], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 23, 0, 0.0, 139.86956521739134, 134, 168, 138.0, 146.4, 163.99999999999994, 168.0, 0.12814441318216008, 0.10374191262501044, 0.04555133437334596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/529d33b0-1fc6-44e0-81ea-b4e2c50b136d", 3, 0, 0.0, 492.0, 455, 532, 489.0, 532.0, 532.0, 532.0, 0.07403385815112778, 0.033498392848329304, 0.04747613950446671], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=395e32f1-1f43-4e4b-82ac-f00897e3097c", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.32261439732142855, 1.231166294642857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1152.0, 266, 2125, 1442.0, 1976.2, 2125.0, 2125.0, 0.07381126950462796, 53.0281207866067, 0.1546720918974909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 23, 11, 47.82608695652174, 888.391304347826, 129, 2140, 1304.0, 1717.8000000000002, 2062.599999999999, 2140.0, 0.13083495454907448, 81.68148648062504, 0.19528583526741525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 374.6923076923077, 270, 541, 284.0, 540.2, 541.0, 541.0, 0.08784614760855756, 0.13614437134255944, 0.19756804486573057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=253ecaf7-a302-43ce-b50d-79758f2d4f76", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["register", 26, 12, 46.15384615384615, 908.5769230769231, 196, 1934, 982.5, 1460.3000000000002, 1812.5499999999995, 1934.0, 0.10587612493382742, 0.03260908294987173, 0.04776832980412917], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 178.20000000000002, 133, 410, 140.0, 404.6, 410.0, 410.0, 0.07976474717233971, 0.06192673242383796, 0.02835387497141763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 0, 0.0, 430.82608695652175, 264, 1586, 274.0, 956.0000000000003, 1480.7999999999984, 1586.0, 0.13410531348574695, 14.140770994405475, 0.29862233210597816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bee4e217-dcbd-4561-ba31-26ce1367c30c", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10e5ede0-4724-4b9b-9408-035e423f81a6", 3, 0, 0.0, 318.0, 221, 459, 274.0, 459.0, 459.0, 459.0, 0.046628741956542014, 0.030524218774285804, 0.029901895069787687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fda03966-357f-47ee-8cac-070db6097110", 3, 0, 0.0, 632.3333333333334, 234, 1077, 586.0, 1077.0, 1077.0, 1077.0, 0.033559674694886625, 0.027977319952345262, 0.021521015347957893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 471.5, 265, 1622, 284.5, 882.2000000000012, 1622.0, 1622.0, 0.10237568463739102, 6.9541205413256515, 0.22879010425257218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dba4f7a3-c299-41a2-a92f-3e7e27f67626", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 0.6002128322259136, 2.290541943521595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 180.16666666666669, 131, 400, 137.0, 400.0, 400.0, 400.0, 0.034812274808097336, 0.025871231571252023, 0.017474130128283232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 221.16666666666666, 130, 404, 132.5, 404.0, 404.0, 404.0, 0.034811668871405695, 0.01802909022604377, 0.019366257194411568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 353.8333333333333, 127, 1452, 137.0, 1452.0, 1452.0, 1452.0, 0.03481086098862845, 5.228297830485611, 0.019966385762357854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b611d54e-9f95-4741-bbc8-498f2eeaeb17", 3, 0, 0.0, 1069.6666666666667, 244, 2096, 869.0, 2096.0, 2096.0, 2096.0, 0.0327507341622908, 0.027302939514852458, 0.02100226116527112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 374.16666666666663, 133, 1054, 264.5, 1054.0, 1054.0, 1054.0, 0.034811668871405695, 1.7137834445856253, 0.020000844908213234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 6, 6, 100.0, 138.5, 132, 142, 139.0, 142.0, 142.0, 142.0, 0.04153887692723081, 0.012250723468773149, 0.025677840913024514], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1523.392857142857, 1019, 2329, 1440.0, 2064.5000000000005, 2213.25, 2329.0, 0.25558172225569126, 305.7645944009347, 0.5046740648447341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 12, 46.15384615384615, 908.5769230769231, 196, 1934, 982.5, 1460.3000000000002, 1812.5499999999995, 1934.0, 0.10462945077586762, 0.03222511629965875, 0.047205865486768396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 133.85714285714286, 129, 138, 135.0, 138.0, 138.0, 138.0, 0.03390388732285219, 0.009138157129987504, 0.01996488677312487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 132.42857142857142, 129, 137, 132.0, 137.0, 137.0, 137.0, 0.03390290208841877, 0.00913789157851912, 0.019931198298074316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 186.5333333333333, 129, 409, 133.0, 405.4, 409.0, 409.0, 0.07817671063672324, 0.021071066538804313, 0.045959355276667384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 205.66666666666669, 130, 409, 136.0, 408.4, 409.0, 409.0, 0.078174266073932, 0.021070407652739487, 0.046034260197833014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 133.0, 130, 137, 133.0, 137.0, 137.0, 137.0, 0.03390388732285219, 0.009071938600060059, 0.019335810738814137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 150.9333333333333, 127, 397, 133.0, 242.8000000000001, 397.0, 397.0, 0.07817834043018936, 0.05809933307360751, 0.03924186228624739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 136.14285714285717, 131, 148, 135.0, 148.0, 148.0, 148.0, 0.03390372311313672, 0.025196028602633834, 0.017018079765773707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 187.13333333333333, 128, 405, 134.0, 404.4, 405.0, 405.0, 0.07817630319897433, 0.020918268629413053, 0.04458492291816505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 146.28571428571428, 137, 181, 139.0, 181.0, 181.0, 181.0, 0.03356058644727632, 0.026415852223149135, 0.011929739713680254], "isController": false}, {"data": ["deleteAccount", 17, 5, 29.41176470588235, 425.5882352941176, 129, 869, 478.0, 697.7999999999998, 869.0, 869.0, 0.1028850169155072, 0.021217670652956735, 0.07000058251075754], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1351.16, 877, 2339, 1242.0, 1977.8000000000006, 2284.1, 2339.0, 0.10908789429819393, 0.05646150779105741, 0.05017617013129819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 273.2857142857143, 267, 285, 272.0, 285.0, 285.0, 285.0, 0.0338810774182619, 0.052509052600372697, 0.07619933720142301], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e29c5153-6f8f-4795-8c79-6b65587e39dc", 3, 0, 0.0, 447.3333333333333, 235, 655, 452.0, 655.0, 655.0, 655.0, 0.027859809438903437, 0.027941429974368975, 0.017865828318567634], "isController": false}, {"data": ["addBook", 54, 19, 35.18518518518518, 1242.1111111111109, 679, 3594, 1009.0, 2187.5, 2486.25, 3594.0, 0.25530707767954236, 74.6171686622382, 0.9264023420878446], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=639028df-81b4-4965-85ee-adbee8b7e81a", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=529d33b0-1fc6-44e0-81ea-b4e2c50b136d", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 0.7344067581300813, 2.802654979674797], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 252.25, 131, 563, 138.0, 518.0, 544.6999999999999, 563.0, 0.25723827154255685, 0.1911702389100447, 0.1243485785288727], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 867.5000000000001, 642, 1321, 806.5, 1083.0, 1140.6999999999998, 1321.0, 0.25697621593344316, 75.55953989785195, 0.1292409679743391], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd69b0e8-db26-4a0b-8e83-be5f61919e6a", 3, 0, 0.0, 340.6666666666667, 241, 478, 303.0, 478.0, 478.0, 478.0, 0.01534597500652204, 0.021155665414264595, 0.009841006107698051], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 173.73214285714286, 126, 417, 136.0, 392.6, 404.0, 417.0, 0.2577734815530852, 0.4561382310294828, 0.12536249395843402], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1269.107142857143, 879, 1767, 1269.5, 1617.9, 1647.8, 1767.0, 0.2562635854021279, 230.5864246081684, 0.12863230751630247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 140.5, 132, 153, 139.0, 151.2, 153.0, 153.0, 0.10547101597885893, 0.07879426486701863, 0.037491650211235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 19, 11.585365853658537, 186.22560975609744, 128, 1452, 139.5, 291.0, 402.5, 796.7999999999943, 0.7203946356955542, 1.6866961793277488, 0.3406448767422349], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 230.16666666666666, 137, 409, 149.5, 409.0, 409.0, 409.0, 0.035224083880285084, 0.027278025895572332, 0.012521061066820088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dca9bb66-2104-43da-bf31-b4cee19860ac", 3, 0, 0.0, 614.3333333333334, 266, 1058, 519.0, 1058.0, 1058.0, 1058.0, 0.07342683016374182, 0.033223728492057666, 0.04708686699953497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 160.61538461538464, 132, 407, 140.0, 302.19999999999993, 407.0, 407.0, 0.08298384368397198, 0.06734333408337961, 0.029498163184536918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 624.1666666666666, 265, 1584, 411.0, 1584.0, 1584.0, 1584.0, 0.03478442353514096, 6.980634813917827, 0.07674766364621921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 394.40000000000003, 266, 802, 276.0, 646.6000000000001, 802.0, 802.0, 0.0781217449272947, 0.12107344648400066, 0.1756976353198825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/395e32f1-1f43-4e4b-82ac-f00897e3097c", 3, 0, 0.0, 354.0, 237, 527, 298.0, 527.0, 527.0, 527.0, 0.029786727034433455, 0.02987399283629215, 0.019101514406846976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 140.92307692307693, 132, 151, 141.0, 150.2, 151.0, 151.0, 0.07884378619991145, 0.06536950633176251, 0.028026502125749773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 159.46666666666667, 130, 395, 141.0, 252.2000000000001, 395.0, 395.0, 0.07071635669330316, 0.054901858956226575, 0.025137454918322606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10e5ede0-4724-4b9b-9408-035e423f81a6", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/253ecaf7-a302-43ce-b50d-79758f2d4f76", 3, 0, 0.0, 590.0, 252, 1042, 476.0, 1042.0, 1042.0, 1042.0, 0.02017701971967394, 0.027815650557558313, 0.01293903933846278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 150.72222222222223, 128, 407, 135.5, 170.30000000000038, 407.0, 407.0, 0.1032488986784141, 0.07673087099050109, 0.05182610734443832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 177.66666666666666, 131, 394, 135.5, 389.5, 394.0, 394.0, 0.1032488986784141, 0.03624242482906571, 0.05840239895948054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 281.72222222222223, 127, 1487, 137.5, 515.0000000000016, 1487.0, 1487.0, 0.1024555172296028, 5.147728271248136, 0.05974348411370285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 249.50000000000003, 128, 1029, 136.0, 579.9000000000007, 1029.0, 1029.0, 0.10272330906019586, 1.7041525005992193, 0.05999995363183966], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 12, 22.22222222222222, 0.9063444108761329], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 6, 11.11111111111111, 0.45317220543806647], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 9.25925925925926, 0.3776435045317221], "isController": false}, {"data": ["401/Unauthorized", 31, 57.407407407407405, 2.3413897280966767], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1324, 54, "401/Unauthorized", 31, "406/Not Acceptable", 12, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 23, 11, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 6, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 12, "406/Not Acceptable", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
